/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getPluralCase } from '../../i18n/localization';
import { assertDefined, assertEqual, assertIndexInRange } from '../../util/assert';
import { attachPatchData } from '../context_discovery';
import { elementAttributeInternal, elementPropertyInternal, getOrCreateTNode, textBindingInternal } from '../instructions/shared';
import { NATIVE } from '../interfaces/container';
import { COMMENT_MARKER, ELEMENT_MARKER } from '../interfaces/i18n';
import { isLContainer } from '../interfaces/type_checks';
import { HEADER_OFFSET, RENDERER, T_HOST } from '../interfaces/view';
import { appendChild, applyProjection, createTextNode, nativeRemoveNode } from '../node_manipulation';
import { getBindingIndex, getCurrentTNode, setCurrentTNode, setCurrentTNodeAsNotParent } from '../state';
import { renderStringify } from '../util/misc_utils';
import { getNativeByIndex, getNativeByTNode, getTNode, load } from '../util/view_utils';
import { getLocaleId } from './i18n_locale_id';
const i18nIndexStack = [];
let i18nIndexStackPointer = -1;
function popI18nIndex() {
    return i18nIndexStack[i18nIndexStackPointer--];
}
export function pushI18nIndex(index) {
    i18nIndexStack[++i18nIndexStackPointer] = index;
}
let changeMask = 0b0;
let shiftsCounter = 0;
export function setMaskBit(bit) {
    if (bit) {
        changeMask = changeMask | (1 << shiftsCounter);
    }
    shiftsCounter++;
}
export function applyI18n(tView, lView, index) {
    if (shiftsCounter > 0) {
        ngDevMode && assertDefined(tView, `tView should be defined`);
        const tI18n = tView.data[index + HEADER_OFFSET];
        let updateOpCodes;
        let tIcus = null;
        if (Array.isArray(tI18n)) {
            updateOpCodes = tI18n;
        }
        else {
            updateOpCodes = tI18n.update;
            tIcus = tI18n.icus;
        }
        const bindingsStartIndex = getBindingIndex() - shiftsCounter - 1;
        applyUpdateOpCodes(tView, tIcus, lView, updateOpCodes, bindingsStartIndex, changeMask);
        // Reset changeMask & maskBit to default for the next update cycle
        changeMask = 0b0;
        shiftsCounter = 0;
    }
}
/**
 * Apply `I18nMutateOpCodes` OpCodes.
 *
 * @param tView Current `TView`
 * @param rootIndex Pointer to the root (parent) tNode for the i18n.
 * @param createOpCodes OpCodes to process
 * @param lView Current `LView`
 */
export function applyCreateOpCodes(tView, rootindex, createOpCodes, lView) {
    const renderer = lView[RENDERER];
    let currentTNode = null;
    let previousTNode = null;
    const visitedNodes = [];
    for (let i = 0; i < createOpCodes.length; i++) {
        const opCode = createOpCodes[i];
        if (typeof opCode == 'string') {
            const textRNode = createTextNode(opCode, renderer);
            const textNodeIndex = createOpCodes[++i];
            ngDevMode && ngDevMode.rendererCreateTextNode++;
            previousTNode = currentTNode;
            currentTNode =
                createDynamicNodeAtIndex(tView, lView, textNodeIndex, 2 /* Element */, textRNode, null);
            visitedNodes.push(textNodeIndex);
            setCurrentTNodeAsNotParent();
        }
        else if (typeof opCode == 'number') {
            switch (opCode & 7 /* MASK_INSTRUCTION */) {
                case 1 /* AppendChild */:
                    const destinationNodeIndex = opCode >>> 17 /* SHIFT_PARENT */;
                    let destinationTNode;
                    if (destinationNodeIndex === rootindex) {
                        // If the destination node is `i18nStart`, we don't have a
                        // top-level node and we should use the host node instead
                        destinationTNode = lView[T_HOST];
                    }
                    else {
                        destinationTNode = getTNode(tView, destinationNodeIndex);
                    }
                    ngDevMode &&
                        assertDefined(currentTNode, `You need to create or select a node before you can insert it into the DOM`);
                    previousTNode =
                        appendI18nNode(tView, currentTNode, destinationTNode, previousTNode, lView);
                    break;
                case 0 /* Select */:
                    // Negative indices indicate that a given TNode is a sibling node, not a parent node
                    // (see `i18nStartFirstPass` for additional information).
                    const isParent = opCode >= 0;
                    // FIXME(misko): This SHIFT_REF looks suspect as it does not have mask.
                    const nodeIndex = (isParent ? opCode : ~opCode) >>> 3 /* SHIFT_REF */;
                    visitedNodes.push(nodeIndex);
                    previousTNode = currentTNode;
                    currentTNode = getTNode(tView, nodeIndex);
                    if (currentTNode) {
                        setCurrentTNode(currentTNode, isParent);
                    }
                    break;
                case 5 /* ElementEnd */:
                    const elementIndex = opCode >>> 3 /* SHIFT_REF */;
                    previousTNode = currentTNode = getTNode(tView, elementIndex);
                    setCurrentTNode(currentTNode, false);
                    break;
                case 4 /* Attr */:
                    const elementNodeIndex = opCode >>> 3 /* SHIFT_REF */;
                    const attrName = createOpCodes[++i];
                    const attrValue = createOpCodes[++i];
                    // This code is used for ICU expressions only, since we don't support
                    // directives/components in ICUs, we don't need to worry about inputs here
                    elementAttributeInternal(getTNode(tView, elementNodeIndex), lView, attrName, attrValue, null, null);
                    break;
                default:
                    throw new Error(`Unable to determine the type of mutate operation for "${opCode}"`);
            }
        }
        else {
            switch (opCode) {
                case COMMENT_MARKER:
                    const commentValue = createOpCodes[++i];
                    const commentNodeIndex = createOpCodes[++i];
                    ngDevMode &&
                        assertEqual(typeof commentValue, 'string', `Expected "${commentValue}" to be a comment node value`);
                    const commentRNode = renderer.createComment(commentValue);
                    ngDevMode && ngDevMode.rendererCreateComment++;
                    previousTNode = currentTNode;
                    currentTNode = createDynamicNodeAtIndex(tView, lView, commentNodeIndex, 4 /* IcuContainer */, commentRNode, null);
                    visitedNodes.push(commentNodeIndex);
                    attachPatchData(commentRNode, lView);
                    // We will add the case nodes later, during the update phase
                    setCurrentTNodeAsNotParent();
                    break;
                case ELEMENT_MARKER:
                    const tagNameValue = createOpCodes[++i];
                    const elementNodeIndex = createOpCodes[++i];
                    ngDevMode &&
                        assertEqual(typeof tagNameValue, 'string', `Expected "${tagNameValue}" to be an element node tag name`);
                    const elementRNode = renderer.createElement(tagNameValue);
                    ngDevMode && ngDevMode.rendererCreateElement++;
                    previousTNode = currentTNode;
                    currentTNode = createDynamicNodeAtIndex(tView, lView, elementNodeIndex, 2 /* Element */, elementRNode, tagNameValue);
                    visitedNodes.push(elementNodeIndex);
                    break;
                default:
                    throw new Error(`Unable to determine the type of mutate operation for "${opCode}"`);
            }
        }
    }
    setCurrentTNodeAsNotParent();
    return visitedNodes;
}
/**
 * Apply `I18nUpdateOpCodes` OpCodes
 *
 * @param tView Current `TView`
 * @param tIcus If ICUs present than this contains them.
 * @param lView Current `LView`
 * @param updateOpCodes OpCodes to process
 * @param bindingsStartIndex Location of the first `ɵɵi18nApply`
 * @param changeMask Each bit corresponds to a `ɵɵi18nExp` (Counting backwards from
 *     `bindingsStartIndex`)
 */
export function applyUpdateOpCodes(tView, tIcus, lView, updateOpCodes, bindingsStartIndex, changeMask) {
    let caseCreated = false;
    for (let i = 0; i < updateOpCodes.length; i++) {
        // bit code to check if we should apply the next update
        const checkBit = updateOpCodes[i];
        // Number of opCodes to skip until next set of update codes
        const skipCodes = updateOpCodes[++i];
        if (checkBit & changeMask) {
            // The value has been updated since last checked
            let value = '';
            for (let j = i + 1; j <= (i + skipCodes); j++) {
                const opCode = updateOpCodes[j];
                if (typeof opCode == 'string') {
                    value += opCode;
                }
                else if (typeof opCode == 'number') {
                    if (opCode < 0) {
                        // Negative opCode represent `i18nExp` values offset.
                        value += renderStringify(lView[bindingsStartIndex - opCode]);
                    }
                    else {
                        const nodeIndex = opCode >>> 2 /* SHIFT_REF */;
                        switch (opCode & 3 /* MASK_OPCODE */) {
                            case 1 /* Attr */:
                                const propName = updateOpCodes[++j];
                                const sanitizeFn = updateOpCodes[++j];
                                elementPropertyInternal(tView, getTNode(tView, nodeIndex), lView, propName, value, lView[RENDERER], sanitizeFn, false);
                                break;
                            case 0 /* Text */:
                                textBindingInternal(lView, nodeIndex, value);
                                break;
                            case 2 /* IcuSwitch */:
                                caseCreated =
                                    applyIcuSwitchCase(tView, tIcus, updateOpCodes[++j], lView, value);
                                break;
                            case 3 /* IcuUpdate */:
                                applyIcuUpdateCase(tView, tIcus, updateOpCodes[++j], bindingsStartIndex, lView, caseCreated);
                                break;
                        }
                    }
                }
            }
        }
        i += skipCodes;
    }
}
/**
 * Apply OpCodes associated with updating an existing ICU.
 *
 * @param tView Current `TView`
 * @param tIcus ICUs active at this location.
 * @param tIcuIndex Index into `tIcus` to process.
 * @param bindingsStartIndex Location of the first `ɵɵi18nApply`
 * @param lView Current `LView`
 * @param changeMask Each bit corresponds to a `ɵɵi18nExp` (Counting backwards from
 *     `bindingsStartIndex`)
 */
function applyIcuUpdateCase(tView, tIcus, tIcuIndex, bindingsStartIndex, lView, caseCreated) {
    ngDevMode && assertIndexInRange(tIcus, tIcuIndex);
    const tIcu = tIcus[tIcuIndex];
    ngDevMode && assertIndexInRange(lView, tIcu.currentCaseLViewIndex);
    const activeCaseIndex = lView[tIcu.currentCaseLViewIndex];
    if (activeCaseIndex !== null) {
        const mask = caseCreated ?
            -1 : // -1 is same as all bits on, which simulates creation since it marks all bits dirty
            changeMask;
        applyUpdateOpCodes(tView, tIcus, lView, tIcu.update[activeCaseIndex], bindingsStartIndex, mask);
    }
}
/**
 * Apply OpCodes associated with switching a case on ICU.
 *
 * This involves tearing down existing case and than building up a new case.
 *
 * @param tView Current `TView`
 * @param tIcus ICUs active at this location.
 * @param tICuIndex Index into `tIcus` to process.
 * @param lView Current `LView`
 * @param value Value of the case to update to.
 * @returns true if a new case was created (needed so that the update executes regardless of the
 *     bitmask)
 */
function applyIcuSwitchCase(tView, tIcus, tICuIndex, lView, value) {
    applyIcuSwitchCaseRemove(tView, tIcus, tICuIndex, lView);
    // Rebuild a new case for this ICU
    let caseCreated = false;
    const tIcu = tIcus[tICuIndex];
    const caseIndex = getCaseIndex(tIcu, value);
    lView[tIcu.currentCaseLViewIndex] = caseIndex !== -1 ? caseIndex : null;
    if (caseIndex > -1) {
        // Add the nodes for the new case
        applyCreateOpCodes(tView, -1, // -1 means we don't have parent node
        tIcu.create[caseIndex], lView);
        caseCreated = true;
    }
    return caseCreated;
}
/**
 * Apply OpCodes associated with tearing down of DOM.
 *
 * This involves tearing down existing case and than building up a new case.
 *
 * @param tView Current `TView`
 * @param tIcus ICUs active at this location.
 * @param tIcuIndex Index into `tIcus` to process.
 * @param lView Current `LView`
 * @returns true if a new case was created (needed so that the update executes regardless of the
 *     bitmask)
 */
function applyIcuSwitchCaseRemove(tView, tIcus, tIcuIndex, lView) {
    ngDevMode && assertIndexInRange(tIcus, tIcuIndex);
    const tIcu = tIcus[tIcuIndex];
    const activeCaseIndex = lView[tIcu.currentCaseLViewIndex];
    if (activeCaseIndex !== null) {
        const removeCodes = tIcu.remove[activeCaseIndex];
        for (let k = 0; k < removeCodes.length; k++) {
            const removeOpCode = removeCodes[k];
            const nodeOrIcuIndex = removeOpCode >>> 3 /* SHIFT_REF */;
            switch (removeOpCode & 7 /* MASK_INSTRUCTION */) {
                case 3 /* Remove */:
                    // FIXME(misko): this comment is wrong!
                    // Remove DOM element, but do *not* mark TNode as detached, since we are
                    // just switching ICU cases (while keeping the same TNode), so a DOM element
                    // representing a new ICU case will be re-created.
                    removeNode(tView, lView, nodeOrIcuIndex, /* markAsDetached */ false);
                    break;
                case 6 /* RemoveNestedIcu */:
                    applyIcuSwitchCaseRemove(tView, tIcus, nodeOrIcuIndex, lView);
                    break;
            }
        }
    }
}
function appendI18nNode(tView, tNode, parentTNode, previousTNode, lView) {
    ngDevMode && ngDevMode.rendererMoveNode++;
    const nextNode = tNode.next;
    if (!previousTNode) {
        previousTNode = parentTNode;
    }
    // Re-organize node tree to put this node in the correct position.
    if (previousTNode === parentTNode && tNode !== parentTNode.child) {
        tNode.next = parentTNode.child;
        // FIXME(misko): Checking `tNode.parent` is a temporary workaround until we properly
        // refactor the i18n code in #38707 and this code will be deleted.
        if (tNode.parent === null) {
            tView.firstChild = tNode;
        }
        else {
            parentTNode.child = tNode;
        }
    }
    else if (previousTNode !== parentTNode && tNode !== previousTNode.next) {
        tNode.next = previousTNode.next;
        previousTNode.next = tNode;
    }
    else {
        tNode.next = null;
    }
    if (parentTNode !== lView[T_HOST]) {
        tNode.parent = parentTNode;
    }
    // If tNode was moved around, we might need to fix a broken link.
    let cursor = tNode.next;
    while (cursor) {
        if (cursor.next === tNode) {
            cursor.next = nextNode;
        }
        cursor = cursor.next;
    }
    // If the placeholder to append is a projection, we need to move the projected nodes instead
    if (tNode.type === 1 /* Projection */) {
        applyProjection(tView, lView, tNode);
        return tNode;
    }
    appendChild(tView, lView, getNativeByTNode(tNode, lView), tNode);
    const slotValue = lView[tNode.index];
    if (tNode.type !== 0 /* Container */ && isLContainer(slotValue)) {
        // Nodes that inject ViewContainerRef also have a comment node that should be moved
        appendChild(tView, lView, slotValue[NATIVE], tNode);
    }
    return tNode;
}
/**
 * See `i18nEnd` above.
 */
export function i18nEndFirstPass(tView, lView) {
    ngDevMode &&
        assertEqual(getBindingIndex(), tView.bindingStartIndex, 'i18nEnd should be called before any binding');
    const rootIndex = popI18nIndex();
    const tI18n = tView.data[rootIndex + HEADER_OFFSET];
    ngDevMode && assertDefined(tI18n, `You should call i18nStart before i18nEnd`);
    // Find the last node that was added before `i18nEnd`
    const lastCreatedNode = getCurrentTNode();
    // Read the instructions to insert/move/remove DOM elements
    const visitedNodes = applyCreateOpCodes(tView, rootIndex, tI18n.create, lView);
    // Remove deleted nodes
    let index = rootIndex + 1;
    while (lastCreatedNode !== null && index <= lastCreatedNode.index - HEADER_OFFSET) {
        if (visitedNodes.indexOf(index) === -1) {
            removeNode(tView, lView, index, /* markAsDetached */ true);
        }
        // Check if an element has any local refs and skip them
        const tNode = getTNode(tView, index);
        if (tNode &&
            (tNode.type === 0 /* Container */ || tNode.type === 2 /* Element */ ||
                tNode.type === 3 /* ElementContainer */) &&
            tNode.localNames !== null) {
            // Divide by 2 to get the number of local refs,
            // since they are stored as an array that also includes directive indexes,
            // i.e. ["localRef", directiveIndex, ...]
            index += tNode.localNames.length >> 1;
        }
        index++;
    }
}
function removeNode(tView, lView, index, markAsDetached) {
    const removedPhTNode = getTNode(tView, index);
    const removedPhRNode = getNativeByIndex(index, lView);
    if (removedPhRNode) {
        nativeRemoveNode(lView[RENDERER], removedPhRNode);
    }
    const slotValue = load(lView, index);
    if (isLContainer(slotValue)) {
        const lContainer = slotValue;
        if (removedPhTNode.type !== 0 /* Container */) {
            nativeRemoveNode(lView[RENDERER], lContainer[NATIVE]);
        }
    }
    if (markAsDetached && removedPhTNode) {
        // Define this node as detached to avoid projecting it later
        removedPhTNode.flags |= 64 /* isDetached */;
    }
    ngDevMode && ngDevMode.rendererRemoveNode++;
}
/**
 * Creates and stores the dynamic TNode, and unhooks it from the tree for now.
 */
function createDynamicNodeAtIndex(tView, lView, index, type, native, name) {
    const currentTNode = getCurrentTNode();
    ngDevMode && assertIndexInRange(lView, index + HEADER_OFFSET);
    lView[index + HEADER_OFFSET] = native;
    // FIXME(misko): Why does this create A TNode??? I would not expect this to be here.
    const tNode = getOrCreateTNode(tView, index, type, name, null);
    // We are creating a dynamic node, the previous tNode might not be pointing at this node.
    // We will link ourselves into the tree later with `appendI18nNode`.
    if (currentTNode && currentTNode.next === tNode) {
        currentTNode.next = null;
    }
    return tNode;
}
/**
 * Returns the index of the current case of an ICU expression depending on the main binding value
 *
 * @param icuExpression
 * @param bindingValue The value of the main binding used by this ICU expression
 */
function getCaseIndex(icuExpression, bindingValue) {
    let index = icuExpression.cases.indexOf(bindingValue);
    if (index === -1) {
        switch (icuExpression.type) {
            case 1 /* plural */: {
                const resolvedCase = getPluralCase(bindingValue, getLocaleId());
                index = icuExpression.cases.indexOf(resolvedCase);
                if (index === -1 && resolvedCase !== 'other') {
                    index = icuExpression.cases.indexOf('other');
                }
                break;
            }
            case 0 /* select */: {
                index = icuExpression.cases.indexOf('other');
                break;
            }
        }
    }
    return index;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9hcHBseS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaTE4bi9pMThuX2FwcGx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUUsdUJBQXVCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNoSSxPQUFPLEVBQWEsTUFBTSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGNBQWMsRUFBRSxjQUFjLEVBQWlHLE1BQU0sb0JBQW9CLENBQUM7QUFJbEssT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQVMsUUFBUSxFQUFFLE1BQU0sRUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3BHLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFzQixlQUFlLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFdEYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRzdDLE1BQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztBQUNwQyxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRS9CLFNBQVMsWUFBWTtJQUNuQixPQUFPLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYTtJQUN6QyxjQUFjLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNsRCxDQUFDO0FBRUQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUV0QixNQUFNLFVBQVUsVUFBVSxDQUFDLEdBQVk7SUFDckMsSUFBSSxHQUFHLEVBQUU7UUFDUCxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsYUFBYSxFQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVELE1BQU0sVUFBVSxTQUFTLENBQUMsS0FBWSxFQUFFLEtBQVksRUFBRSxLQUFhO0lBQ2pFLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRTtRQUNyQixTQUFTLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBOEIsQ0FBQztRQUM3RSxJQUFJLGFBQWdDLENBQUM7UUFDckMsSUFBSSxLQUFLLEdBQWdCLElBQUksQ0FBQztRQUM5QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsYUFBYSxHQUFHLEtBQTBCLENBQUM7U0FDNUM7YUFBTTtZQUNMLGFBQWEsR0FBSSxLQUFlLENBQUMsTUFBTSxDQUFDO1lBQ3hDLEtBQUssR0FBSSxLQUFlLENBQUMsSUFBSSxDQUFDO1NBQy9CO1FBQ0QsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLEVBQUUsR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ2pFLGtCQUFrQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV2RixrRUFBa0U7UUFDbEUsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUNqQixhQUFhLEdBQUcsQ0FBQyxDQUFDO0tBQ25CO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLEtBQVksRUFBRSxTQUFpQixFQUFFLGFBQWdDLEVBQUUsS0FBWTtJQUNqRixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsSUFBSSxZQUFZLEdBQWUsSUFBSSxDQUFDO0lBQ3BDLElBQUksYUFBYSxHQUFlLElBQUksQ0FBQztJQUNyQyxNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0MsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksT0FBTyxNQUFNLElBQUksUUFBUSxFQUFFO1lBQzdCLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbkQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFXLENBQUM7WUFDbkQsU0FBUyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ2hELGFBQWEsR0FBRyxZQUFZLENBQUM7WUFDN0IsWUFBWTtnQkFDUix3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsbUJBQXFCLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RixZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pDLDBCQUEwQixFQUFFLENBQUM7U0FDOUI7YUFBTSxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRTtZQUNwQyxRQUFRLE1BQU0sMkJBQW9DLEVBQUU7Z0JBQ2xEO29CQUNFLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSwwQkFBa0MsQ0FBQztvQkFDdEUsSUFBSSxnQkFBdUIsQ0FBQztvQkFDNUIsSUFBSSxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7d0JBQ3RDLDBEQUEwRDt3QkFDMUQseURBQXlEO3dCQUN6RCxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUM7cUJBQ25DO3lCQUFNO3dCQUNMLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztxQkFDMUQ7b0JBQ0QsU0FBUzt3QkFDTCxhQUFhLENBQ1QsWUFBYSxFQUNiLDJFQUEyRSxDQUFDLENBQUM7b0JBQ3JGLGFBQWE7d0JBQ1QsY0FBYyxDQUFDLEtBQUssRUFBRSxZQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNqRixNQUFNO2dCQUNSO29CQUNFLG9GQUFvRjtvQkFDcEYseURBQXlEO29CQUN6RCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUM3Qix1RUFBdUU7b0JBQ3ZFLE1BQU0sU0FBUyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUErQixDQUFDO29CQUMvRSxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM3QixhQUFhLEdBQUcsWUFBWSxDQUFDO29CQUM3QixZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxZQUFZLEVBQUU7d0JBQ2hCLGVBQWUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ3pDO29CQUNELE1BQU07Z0JBQ1I7b0JBQ0UsTUFBTSxZQUFZLEdBQUcsTUFBTSxzQkFBK0IsQ0FBQztvQkFDM0QsYUFBYSxHQUFHLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUM3RCxlQUFlLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxNQUFNO2dCQUNSO29CQUNFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxzQkFBK0IsQ0FBQztvQkFDL0QsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFXLENBQUM7b0JBQzlDLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBVyxDQUFDO29CQUMvQyxxRUFBcUU7b0JBQ3JFLDBFQUEwRTtvQkFDMUUsd0JBQXdCLENBQ3BCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQy9FLE1BQU07Z0JBQ1I7b0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUN2RjtTQUNGO2FBQU07WUFDTCxRQUFRLE1BQU0sRUFBRTtnQkFDZCxLQUFLLGNBQWM7b0JBQ2pCLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBVyxDQUFDO29CQUNsRCxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBVyxDQUFDO29CQUN0RCxTQUFTO3dCQUNMLFdBQVcsQ0FDUCxPQUFPLFlBQVksRUFBRSxRQUFRLEVBQzdCLGFBQWEsWUFBWSw4QkFBOEIsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMxRCxTQUFTLElBQUksU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQy9DLGFBQWEsR0FBRyxZQUFZLENBQUM7b0JBQzdCLFlBQVksR0FBRyx3QkFBd0IsQ0FDbkMsS0FBSyxFQUFFLEtBQUssRUFBRSxnQkFBZ0Isd0JBQTBCLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDaEYsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNwQyxlQUFlLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNyQyw0REFBNEQ7b0JBQzVELDBCQUEwQixFQUFFLENBQUM7b0JBQzdCLE1BQU07Z0JBQ1IsS0FBSyxjQUFjO29CQUNqQixNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQVcsQ0FBQztvQkFDbEQsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQVcsQ0FBQztvQkFDdEQsU0FBUzt3QkFDTCxXQUFXLENBQ1AsT0FBTyxZQUFZLEVBQUUsUUFBUSxFQUM3QixhQUFhLFlBQVksa0NBQWtDLENBQUMsQ0FBQztvQkFDckUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDMUQsU0FBUyxJQUFJLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO29CQUMvQyxhQUFhLEdBQUcsWUFBWSxDQUFDO29CQUM3QixZQUFZLEdBQUcsd0JBQXdCLENBQ25DLEtBQUssRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLG1CQUFxQixZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ25GLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDcEMsTUFBTTtnQkFDUjtvQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZGO1NBQ0Y7S0FDRjtJQUVELDBCQUEwQixFQUFFLENBQUM7SUFFN0IsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQUdEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLEtBQVksRUFBRSxLQUFrQixFQUFFLEtBQVksRUFBRSxhQUFnQyxFQUNoRixrQkFBMEIsRUFBRSxVQUFrQjtJQUNoRCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0MsdURBQXVEO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQVcsQ0FBQztRQUM1QywyREFBMkQ7UUFDM0QsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFXLENBQUM7UUFDL0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxFQUFFO1lBQ3pCLGdEQUFnRDtZQUNoRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksT0FBTyxNQUFNLElBQUksUUFBUSxFQUFFO29CQUM3QixLQUFLLElBQUksTUFBTSxDQUFDO2lCQUNqQjtxQkFBTSxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRTtvQkFDcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNkLHFEQUFxRDt3QkFDckQsS0FBSyxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDOUQ7eUJBQU07d0JBQ0wsTUFBTSxTQUFTLEdBQUcsTUFBTSxzQkFBK0IsQ0FBQzt3QkFDeEQsUUFBUSxNQUFNLHNCQUErQixFQUFFOzRCQUM3QztnQ0FDRSxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQVcsQ0FBQztnQ0FDOUMsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUF1QixDQUFDO2dDQUM1RCx1QkFBdUIsQ0FDbkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUMxRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0NBQ3ZCLE1BQU07NEJBQ1I7Z0NBQ0UsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQ0FDN0MsTUFBTTs0QkFDUjtnQ0FDRSxXQUFXO29DQUNQLGtCQUFrQixDQUFDLEtBQUssRUFBRSxLQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dDQUNsRixNQUFNOzRCQUNSO2dDQUNFLGtCQUFrQixDQUNkLEtBQUssRUFBRSxLQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFXLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUN0RSxXQUFXLENBQUMsQ0FBQztnQ0FDakIsTUFBTTt5QkFDVDtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxDQUFDLElBQUksU0FBUyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFTLGtCQUFrQixDQUN2QixLQUFZLEVBQUUsS0FBYSxFQUFFLFNBQWlCLEVBQUUsa0JBQTBCLEVBQUUsS0FBWSxFQUN4RixXQUFvQjtJQUN0QixTQUFTLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixTQUFTLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUMxRCxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLG9GQUFvRjtZQUMxRixVQUFVLENBQUM7UUFDZixrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pHO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQVMsa0JBQWtCLENBQ3ZCLEtBQVksRUFBRSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxLQUFZLEVBQUUsS0FBYTtJQUM3RSx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV6RCxrQ0FBa0M7SUFDbEMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxTQUFTLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hFLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLGlDQUFpQztRQUNqQyxrQkFBa0IsQ0FDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUcscUNBQXFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsV0FBVyxHQUFHLElBQUksQ0FBQztLQUNwQjtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQVMsd0JBQXdCLENBQUMsS0FBWSxFQUFFLEtBQWEsRUFBRSxTQUFpQixFQUFFLEtBQVk7SUFDNUYsU0FBUyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQzFELElBQUksZUFBZSxLQUFLLElBQUksRUFBRTtRQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQVcsQ0FBQztZQUM5QyxNQUFNLGNBQWMsR0FBRyxZQUFZLHNCQUErQixDQUFDO1lBQ25FLFFBQVEsWUFBWSwyQkFBb0MsRUFBRTtnQkFDeEQ7b0JBQ0UsdUNBQXVDO29CQUN2Qyx3RUFBd0U7b0JBQ3hFLDRFQUE0RTtvQkFDNUUsa0RBQWtEO29CQUNsRCxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3JFLE1BQU07Z0JBQ1I7b0JBQ0Usd0JBQXdCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzlELE1BQU07YUFDVDtTQUNGO0tBQ0Y7QUFDSCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQ25CLEtBQVksRUFBRSxLQUFZLEVBQUUsV0FBa0IsRUFBRSxhQUF5QixFQUN6RSxLQUFZO0lBQ2QsU0FBUyxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNsQixhQUFhLEdBQUcsV0FBVyxDQUFDO0tBQzdCO0lBRUQsa0VBQWtFO0lBQ2xFLElBQUksYUFBYSxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtRQUNoRSxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFDL0Isb0ZBQW9GO1FBQ3BGLGtFQUFrRTtRQUNsRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ3pCLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQzFCO2FBQU07WUFDTCxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUMzQjtLQUNGO1NBQU0sSUFBSSxhQUFhLEtBQUssV0FBVyxJQUFJLEtBQUssS0FBSyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQ3hFLEtBQUssQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUNoQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztLQUM1QjtTQUFNO1FBQ0wsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbkI7SUFFRCxJQUFJLFdBQVcsS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUEyQixDQUFDO0tBQzVDO0lBRUQsaUVBQWlFO0lBQ2pFLElBQUksTUFBTSxHQUFlLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDcEMsT0FBTyxNQUFNLEVBQUU7UUFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1NBQ3hCO1FBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDdEI7SUFFRCw0RkFBNEY7SUFDNUYsSUFBSSxLQUFLLENBQUMsSUFBSSx1QkFBeUIsRUFBRTtRQUN2QyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUF3QixDQUFDLENBQUM7UUFDeEQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVqRSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksc0JBQXdCLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2pFLG1GQUFtRjtRQUNuRixXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDckQ7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFZLEVBQUUsS0FBWTtJQUN6RCxTQUFTO1FBQ0wsV0FBVyxDQUNQLGVBQWUsRUFBRSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFDMUMsNkNBQTZDLENBQUMsQ0FBQztJQUV2RCxNQUFNLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQztJQUNqQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQVUsQ0FBQztJQUM3RCxTQUFTLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO0lBRTlFLHFEQUFxRDtJQUNyRCxNQUFNLGVBQWUsR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUUxQywyREFBMkQ7SUFDM0QsTUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRS9FLHVCQUF1QjtJQUN2QixJQUFJLEtBQUssR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sZUFBZSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksZUFBZSxDQUFDLEtBQUssR0FBRyxhQUFhLEVBQUU7UUFDakYsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1RDtRQUNELHVEQUF1RDtRQUN2RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSztZQUNMLENBQUMsS0FBSyxDQUFDLElBQUksc0JBQXdCLElBQUksS0FBSyxDQUFDLElBQUksb0JBQXNCO2dCQUN0RSxLQUFLLENBQUMsSUFBSSw2QkFBK0IsQ0FBQztZQUMzQyxLQUFLLENBQUMsVUFBVSxLQUFLLElBQUksRUFBRTtZQUM3QiwrQ0FBK0M7WUFDL0MsMEVBQTBFO1lBQzFFLHlDQUF5QztZQUN6QyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsS0FBSyxFQUFFLENBQUM7S0FDVDtBQUNILENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxLQUFZLEVBQUUsS0FBWSxFQUFFLEtBQWEsRUFBRSxjQUF1QjtJQUNwRixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlDLE1BQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RCxJQUFJLGNBQWMsRUFBRTtRQUNsQixnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDbkQ7SUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBcUMsQ0FBQztJQUN6RSxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMzQixNQUFNLFVBQVUsR0FBRyxTQUF1QixDQUFDO1FBQzNDLElBQUksY0FBYyxDQUFDLElBQUksc0JBQXdCLEVBQUU7WUFDL0MsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0Y7SUFFRCxJQUFJLGNBQWMsSUFBSSxjQUFjLEVBQUU7UUFDcEMsNERBQTREO1FBQzVELGNBQWMsQ0FBQyxLQUFLLHVCQUF5QixDQUFDO0tBQy9DO0lBQ0QsU0FBUyxJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQzlDLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsd0JBQXdCLENBQzdCLEtBQVksRUFBRSxLQUFZLEVBQUUsS0FBYSxFQUFFLElBQWUsRUFBRSxNQUEyQixFQUN2RixJQUFpQjtJQUNuQixNQUFNLFlBQVksR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUN2QyxTQUFTLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQztJQUM5RCxLQUFLLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN0QyxvRkFBb0Y7SUFDcEYsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXRFLHlGQUF5RjtJQUN6RixvRUFBb0U7SUFDcEUsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDL0MsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDMUI7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFHRDs7Ozs7R0FLRztBQUNILFNBQVMsWUFBWSxDQUFDLGFBQW1CLEVBQUUsWUFBb0I7SUFDN0QsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEQsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDaEIsUUFBUSxhQUFhLENBQUMsSUFBSSxFQUFFO1lBQzFCLG1CQUFtQixDQUFDLENBQUM7Z0JBQ25CLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDaEUsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssT0FBTyxFQUFFO29CQUM1QyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlDO2dCQUNELE1BQU07YUFDUDtZQUNELG1CQUFtQixDQUFDLENBQUM7Z0JBQ25CLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MsTUFBTTthQUNQO1NBQ0Y7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2dldFBsdXJhbENhc2V9IGZyb20gJy4uLy4uL2kxOG4vbG9jYWxpemF0aW9uJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZCwgYXNzZXJ0RXF1YWwsIGFzc2VydEluZGV4SW5SYW5nZX0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHthdHRhY2hQYXRjaERhdGF9IGZyb20gJy4uL2NvbnRleHRfZGlzY292ZXJ5JztcbmltcG9ydCB7ZWxlbWVudEF0dHJpYnV0ZUludGVybmFsLCBlbGVtZW50UHJvcGVydHlJbnRlcm5hbCwgZ2V0T3JDcmVhdGVUTm9kZSwgdGV4dEJpbmRpbmdJbnRlcm5hbH0gZnJvbSAnLi4vaW5zdHJ1Y3Rpb25zL3NoYXJlZCc7XG5pbXBvcnQge0xDb250YWluZXIsIE5BVElWRX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtDT01NRU5UX01BUktFUiwgRUxFTUVOVF9NQVJLRVIsIEkxOG5NdXRhdGVPcENvZGUsIEkxOG5NdXRhdGVPcENvZGVzLCBJMThuVXBkYXRlT3BDb2RlLCBJMThuVXBkYXRlT3BDb2RlcywgSWN1VHlwZSwgVEkxOG4sIFRJY3V9IGZyb20gJy4uL2ludGVyZmFjZXMvaTE4bic7XG5pbXBvcnQge1RFbGVtZW50Tm9kZSwgVEljdUNvbnRhaW5lck5vZGUsIFROb2RlLCBUTm9kZUZsYWdzLCBUTm9kZVR5cGUsIFRQcm9qZWN0aW9uTm9kZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7UkNvbW1lbnQsIFJFbGVtZW50LCBSVGV4dH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yZW5kZXJlcic7XG5pbXBvcnQge1Nhbml0aXplckZufSBmcm9tICcuLi9pbnRlcmZhY2VzL3Nhbml0aXphdGlvbic7XG5pbXBvcnQge2lzTENvbnRhaW5lcn0gZnJvbSAnLi4vaW50ZXJmYWNlcy90eXBlX2NoZWNrcyc7XG5pbXBvcnQge0hFQURFUl9PRkZTRVQsIExWaWV3LCBSRU5ERVJFUiwgVF9IT1NULCBUVmlld30gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7YXBwZW5kQ2hpbGQsIGFwcGx5UHJvamVjdGlvbiwgY3JlYXRlVGV4dE5vZGUsIG5hdGl2ZVJlbW92ZU5vZGV9IGZyb20gJy4uL25vZGVfbWFuaXB1bGF0aW9uJztcbmltcG9ydCB7Z2V0QmluZGluZ0luZGV4LCBnZXRDdXJyZW50VE5vZGUsIGdldExWaWV3LCBnZXRUVmlldywgc2V0Q3VycmVudFROb2RlLCBzZXRDdXJyZW50VE5vZGVBc05vdFBhcmVudH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHtyZW5kZXJTdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwvbWlzY191dGlscyc7XG5pbXBvcnQge2dldE5hdGl2ZUJ5SW5kZXgsIGdldE5hdGl2ZUJ5VE5vZGUsIGdldFROb2RlLCBsb2FkfSBmcm9tICcuLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5pbXBvcnQge2dldExvY2FsZUlkfSBmcm9tICcuL2kxOG5fbG9jYWxlX2lkJztcblxuXG5jb25zdCBpMThuSW5kZXhTdGFjazogbnVtYmVyW10gPSBbXTtcbmxldCBpMThuSW5kZXhTdGFja1BvaW50ZXIgPSAtMTtcblxuZnVuY3Rpb24gcG9wSTE4bkluZGV4KCkge1xuICByZXR1cm4gaTE4bkluZGV4U3RhY2tbaTE4bkluZGV4U3RhY2tQb2ludGVyLS1dO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHVzaEkxOG5JbmRleChpbmRleDogbnVtYmVyKSB7XG4gIGkxOG5JbmRleFN0YWNrWysraTE4bkluZGV4U3RhY2tQb2ludGVyXSA9IGluZGV4O1xufVxuXG5sZXQgY2hhbmdlTWFzayA9IDBiMDtcbmxldCBzaGlmdHNDb3VudGVyID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1hc2tCaXQoYml0OiBib29sZWFuKSB7XG4gIGlmIChiaXQpIHtcbiAgICBjaGFuZ2VNYXNrID0gY2hhbmdlTWFzayB8ICgxIDw8IHNoaWZ0c0NvdW50ZXIpO1xuICB9XG4gIHNoaWZ0c0NvdW50ZXIrKztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5STE4bih0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgaW5kZXg6IG51bWJlcikge1xuICBpZiAoc2hpZnRzQ291bnRlciA+IDApIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCh0VmlldywgYHRWaWV3IHNob3VsZCBiZSBkZWZpbmVkYCk7XG4gICAgY29uc3QgdEkxOG4gPSB0Vmlldy5kYXRhW2luZGV4ICsgSEVBREVSX09GRlNFVF0gYXMgVEkxOG4gfCBJMThuVXBkYXRlT3BDb2RlcztcbiAgICBsZXQgdXBkYXRlT3BDb2RlczogSTE4blVwZGF0ZU9wQ29kZXM7XG4gICAgbGV0IHRJY3VzOiBUSWN1W118bnVsbCA9IG51bGw7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodEkxOG4pKSB7XG4gICAgICB1cGRhdGVPcENvZGVzID0gdEkxOG4gYXMgSTE4blVwZGF0ZU9wQ29kZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZU9wQ29kZXMgPSAodEkxOG4gYXMgVEkxOG4pLnVwZGF0ZTtcbiAgICAgIHRJY3VzID0gKHRJMThuIGFzIFRJMThuKS5pY3VzO1xuICAgIH1cbiAgICBjb25zdCBiaW5kaW5nc1N0YXJ0SW5kZXggPSBnZXRCaW5kaW5nSW5kZXgoKSAtIHNoaWZ0c0NvdW50ZXIgLSAxO1xuICAgIGFwcGx5VXBkYXRlT3BDb2Rlcyh0VmlldywgdEljdXMsIGxWaWV3LCB1cGRhdGVPcENvZGVzLCBiaW5kaW5nc1N0YXJ0SW5kZXgsIGNoYW5nZU1hc2spO1xuXG4gICAgLy8gUmVzZXQgY2hhbmdlTWFzayAmIG1hc2tCaXQgdG8gZGVmYXVsdCBmb3IgdGhlIG5leHQgdXBkYXRlIGN5Y2xlXG4gICAgY2hhbmdlTWFzayA9IDBiMDtcbiAgICBzaGlmdHNDb3VudGVyID0gMDtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGx5IGBJMThuTXV0YXRlT3BDb2Rlc2AgT3BDb2Rlcy5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgQ3VycmVudCBgVFZpZXdgXG4gKiBAcGFyYW0gcm9vdEluZGV4IFBvaW50ZXIgdG8gdGhlIHJvb3QgKHBhcmVudCkgdE5vZGUgZm9yIHRoZSBpMThuLlxuICogQHBhcmFtIGNyZWF0ZU9wQ29kZXMgT3BDb2RlcyB0byBwcm9jZXNzXG4gKiBAcGFyYW0gbFZpZXcgQ3VycmVudCBgTFZpZXdgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNyZWF0ZU9wQ29kZXMoXG4gICAgdFZpZXc6IFRWaWV3LCByb290aW5kZXg6IG51bWJlciwgY3JlYXRlT3BDb2RlczogSTE4bk11dGF0ZU9wQ29kZXMsIGxWaWV3OiBMVmlldyk6IG51bWJlcltdIHtcbiAgY29uc3QgcmVuZGVyZXIgPSBsVmlld1tSRU5ERVJFUl07XG4gIGxldCBjdXJyZW50VE5vZGU6IFROb2RlfG51bGwgPSBudWxsO1xuICBsZXQgcHJldmlvdXNUTm9kZTogVE5vZGV8bnVsbCA9IG51bGw7XG4gIGNvbnN0IHZpc2l0ZWROb2RlczogbnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjcmVhdGVPcENvZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgb3BDb2RlID0gY3JlYXRlT3BDb2Rlc1tpXTtcbiAgICBpZiAodHlwZW9mIG9wQ29kZSA9PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdGV4dFJOb2RlID0gY3JlYXRlVGV4dE5vZGUob3BDb2RlLCByZW5kZXJlcik7XG4gICAgICBjb25zdCB0ZXh0Tm9kZUluZGV4ID0gY3JlYXRlT3BDb2Rlc1srK2ldIGFzIG51bWJlcjtcbiAgICAgIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJDcmVhdGVUZXh0Tm9kZSsrO1xuICAgICAgcHJldmlvdXNUTm9kZSA9IGN1cnJlbnRUTm9kZTtcbiAgICAgIGN1cnJlbnRUTm9kZSA9XG4gICAgICAgICAgY3JlYXRlRHluYW1pY05vZGVBdEluZGV4KHRWaWV3LCBsVmlldywgdGV4dE5vZGVJbmRleCwgVE5vZGVUeXBlLkVsZW1lbnQsIHRleHRSTm9kZSwgbnVsbCk7XG4gICAgICB2aXNpdGVkTm9kZXMucHVzaCh0ZXh0Tm9kZUluZGV4KTtcbiAgICAgIHNldEN1cnJlbnRUTm9kZUFzTm90UGFyZW50KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3BDb2RlID09ICdudW1iZXInKSB7XG4gICAgICBzd2l0Y2ggKG9wQ29kZSAmIEkxOG5NdXRhdGVPcENvZGUuTUFTS19JTlNUUlVDVElPTikge1xuICAgICAgICBjYXNlIEkxOG5NdXRhdGVPcENvZGUuQXBwZW5kQ2hpbGQ6XG4gICAgICAgICAgY29uc3QgZGVzdGluYXRpb25Ob2RlSW5kZXggPSBvcENvZGUgPj4+IEkxOG5NdXRhdGVPcENvZGUuU0hJRlRfUEFSRU5UO1xuICAgICAgICAgIGxldCBkZXN0aW5hdGlvblROb2RlOiBUTm9kZTtcbiAgICAgICAgICBpZiAoZGVzdGluYXRpb25Ob2RlSW5kZXggPT09IHJvb3RpbmRleCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRlc3RpbmF0aW9uIG5vZGUgaXMgYGkxOG5TdGFydGAsIHdlIGRvbid0IGhhdmUgYVxuICAgICAgICAgICAgLy8gdG9wLWxldmVsIG5vZGUgYW5kIHdlIHNob3VsZCB1c2UgdGhlIGhvc3Qgbm9kZSBpbnN0ZWFkXG4gICAgICAgICAgICBkZXN0aW5hdGlvblROb2RlID0gbFZpZXdbVF9IT1NUXSE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uVE5vZGUgPSBnZXRUTm9kZSh0VmlldywgZGVzdGluYXRpb25Ob2RlSW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgICAgICAgYXNzZXJ0RGVmaW5lZChcbiAgICAgICAgICAgICAgICAgIGN1cnJlbnRUTm9kZSEsXG4gICAgICAgICAgICAgICAgICBgWW91IG5lZWQgdG8gY3JlYXRlIG9yIHNlbGVjdCBhIG5vZGUgYmVmb3JlIHlvdSBjYW4gaW5zZXJ0IGl0IGludG8gdGhlIERPTWApO1xuICAgICAgICAgIHByZXZpb3VzVE5vZGUgPVxuICAgICAgICAgICAgICBhcHBlbmRJMThuTm9kZSh0VmlldywgY3VycmVudFROb2RlISwgZGVzdGluYXRpb25UTm9kZSwgcHJldmlvdXNUTm9kZSwgbFZpZXcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEkxOG5NdXRhdGVPcENvZGUuU2VsZWN0OlxuICAgICAgICAgIC8vIE5lZ2F0aXZlIGluZGljZXMgaW5kaWNhdGUgdGhhdCBhIGdpdmVuIFROb2RlIGlzIGEgc2libGluZyBub2RlLCBub3QgYSBwYXJlbnQgbm9kZVxuICAgICAgICAgIC8vIChzZWUgYGkxOG5TdGFydEZpcnN0UGFzc2AgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24pLlxuICAgICAgICAgIGNvbnN0IGlzUGFyZW50ID0gb3BDb2RlID49IDA7XG4gICAgICAgICAgLy8gRklYTUUobWlza28pOiBUaGlzIFNISUZUX1JFRiBsb29rcyBzdXNwZWN0IGFzIGl0IGRvZXMgbm90IGhhdmUgbWFzay5cbiAgICAgICAgICBjb25zdCBub2RlSW5kZXggPSAoaXNQYXJlbnQgPyBvcENvZGUgOiB+b3BDb2RlKSA+Pj4gSTE4bk11dGF0ZU9wQ29kZS5TSElGVF9SRUY7XG4gICAgICAgICAgdmlzaXRlZE5vZGVzLnB1c2gobm9kZUluZGV4KTtcbiAgICAgICAgICBwcmV2aW91c1ROb2RlID0gY3VycmVudFROb2RlO1xuICAgICAgICAgIGN1cnJlbnRUTm9kZSA9IGdldFROb2RlKHRWaWV3LCBub2RlSW5kZXgpO1xuICAgICAgICAgIGlmIChjdXJyZW50VE5vZGUpIHtcbiAgICAgICAgICAgIHNldEN1cnJlbnRUTm9kZShjdXJyZW50VE5vZGUsIGlzUGFyZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSTE4bk11dGF0ZU9wQ29kZS5FbGVtZW50RW5kOlxuICAgICAgICAgIGNvbnN0IGVsZW1lbnRJbmRleCA9IG9wQ29kZSA+Pj4gSTE4bk11dGF0ZU9wQ29kZS5TSElGVF9SRUY7XG4gICAgICAgICAgcHJldmlvdXNUTm9kZSA9IGN1cnJlbnRUTm9kZSA9IGdldFROb2RlKHRWaWV3LCBlbGVtZW50SW5kZXgpO1xuICAgICAgICAgIHNldEN1cnJlbnRUTm9kZShjdXJyZW50VE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBJMThuTXV0YXRlT3BDb2RlLkF0dHI6XG4gICAgICAgICAgY29uc3QgZWxlbWVudE5vZGVJbmRleCA9IG9wQ29kZSA+Pj4gSTE4bk11dGF0ZU9wQ29kZS5TSElGVF9SRUY7XG4gICAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBjcmVhdGVPcENvZGVzWysraV0gYXMgc3RyaW5nO1xuICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGNyZWF0ZU9wQ29kZXNbKytpXSBhcyBzdHJpbmc7XG4gICAgICAgICAgLy8gVGhpcyBjb2RlIGlzIHVzZWQgZm9yIElDVSBleHByZXNzaW9ucyBvbmx5LCBzaW5jZSB3ZSBkb24ndCBzdXBwb3J0XG4gICAgICAgICAgLy8gZGlyZWN0aXZlcy9jb21wb25lbnRzIGluIElDVXMsIHdlIGRvbid0IG5lZWQgdG8gd29ycnkgYWJvdXQgaW5wdXRzIGhlcmVcbiAgICAgICAgICBlbGVtZW50QXR0cmlidXRlSW50ZXJuYWwoXG4gICAgICAgICAgICAgIGdldFROb2RlKHRWaWV3LCBlbGVtZW50Tm9kZUluZGV4KSwgbFZpZXcsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIG51bGwsIG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGRldGVybWluZSB0aGUgdHlwZSBvZiBtdXRhdGUgb3BlcmF0aW9uIGZvciBcIiR7b3BDb2RlfVwiYCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAob3BDb2RlKSB7XG4gICAgICAgIGNhc2UgQ09NTUVOVF9NQVJLRVI6XG4gICAgICAgICAgY29uc3QgY29tbWVudFZhbHVlID0gY3JlYXRlT3BDb2Rlc1srK2ldIGFzIHN0cmluZztcbiAgICAgICAgICBjb25zdCBjb21tZW50Tm9kZUluZGV4ID0gY3JlYXRlT3BDb2Rlc1srK2ldIGFzIG51bWJlcjtcbiAgICAgICAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgICAgICAgYXNzZXJ0RXF1YWwoXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgY29tbWVudFZhbHVlLCAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIGBFeHBlY3RlZCBcIiR7Y29tbWVudFZhbHVlfVwiIHRvIGJlIGEgY29tbWVudCBub2RlIHZhbHVlYCk7XG4gICAgICAgICAgY29uc3QgY29tbWVudFJOb2RlID0gcmVuZGVyZXIuY3JlYXRlQ29tbWVudChjb21tZW50VmFsdWUpO1xuICAgICAgICAgIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJDcmVhdGVDb21tZW50Kys7XG4gICAgICAgICAgcHJldmlvdXNUTm9kZSA9IGN1cnJlbnRUTm9kZTtcbiAgICAgICAgICBjdXJyZW50VE5vZGUgPSBjcmVhdGVEeW5hbWljTm9kZUF0SW5kZXgoXG4gICAgICAgICAgICAgIHRWaWV3LCBsVmlldywgY29tbWVudE5vZGVJbmRleCwgVE5vZGVUeXBlLkljdUNvbnRhaW5lciwgY29tbWVudFJOb2RlLCBudWxsKTtcbiAgICAgICAgICB2aXNpdGVkTm9kZXMucHVzaChjb21tZW50Tm9kZUluZGV4KTtcbiAgICAgICAgICBhdHRhY2hQYXRjaERhdGEoY29tbWVudFJOb2RlLCBsVmlldyk7XG4gICAgICAgICAgLy8gV2Ugd2lsbCBhZGQgdGhlIGNhc2Ugbm9kZXMgbGF0ZXIsIGR1cmluZyB0aGUgdXBkYXRlIHBoYXNlXG4gICAgICAgICAgc2V0Q3VycmVudFROb2RlQXNOb3RQYXJlbnQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFTEVNRU5UX01BUktFUjpcbiAgICAgICAgICBjb25zdCB0YWdOYW1lVmFsdWUgPSBjcmVhdGVPcENvZGVzWysraV0gYXMgc3RyaW5nO1xuICAgICAgICAgIGNvbnN0IGVsZW1lbnROb2RlSW5kZXggPSBjcmVhdGVPcENvZGVzWysraV0gYXMgbnVtYmVyO1xuICAgICAgICAgIG5nRGV2TW9kZSAmJlxuICAgICAgICAgICAgICBhc3NlcnRFcXVhbChcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiB0YWdOYW1lVmFsdWUsICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgYEV4cGVjdGVkIFwiJHt0YWdOYW1lVmFsdWV9XCIgdG8gYmUgYW4gZWxlbWVudCBub2RlIHRhZyBuYW1lYCk7XG4gICAgICAgICAgY29uc3QgZWxlbWVudFJOb2RlID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCh0YWdOYW1lVmFsdWUpO1xuICAgICAgICAgIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJDcmVhdGVFbGVtZW50Kys7XG4gICAgICAgICAgcHJldmlvdXNUTm9kZSA9IGN1cnJlbnRUTm9kZTtcbiAgICAgICAgICBjdXJyZW50VE5vZGUgPSBjcmVhdGVEeW5hbWljTm9kZUF0SW5kZXgoXG4gICAgICAgICAgICAgIHRWaWV3LCBsVmlldywgZWxlbWVudE5vZGVJbmRleCwgVE5vZGVUeXBlLkVsZW1lbnQsIGVsZW1lbnRSTm9kZSwgdGFnTmFtZVZhbHVlKTtcbiAgICAgICAgICB2aXNpdGVkTm9kZXMucHVzaChlbGVtZW50Tm9kZUluZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBkZXRlcm1pbmUgdGhlIHR5cGUgb2YgbXV0YXRlIG9wZXJhdGlvbiBmb3IgXCIke29wQ29kZX1cImApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEN1cnJlbnRUTm9kZUFzTm90UGFyZW50KCk7XG5cbiAgcmV0dXJuIHZpc2l0ZWROb2Rlcztcbn1cblxuXG4vKipcbiAqIEFwcGx5IGBJMThuVXBkYXRlT3BDb2Rlc2AgT3BDb2Rlc1xuICpcbiAqIEBwYXJhbSB0VmlldyBDdXJyZW50IGBUVmlld2BcbiAqIEBwYXJhbSB0SWN1cyBJZiBJQ1VzIHByZXNlbnQgdGhhbiB0aGlzIGNvbnRhaW5zIHRoZW0uXG4gKiBAcGFyYW0gbFZpZXcgQ3VycmVudCBgTFZpZXdgXG4gKiBAcGFyYW0gdXBkYXRlT3BDb2RlcyBPcENvZGVzIHRvIHByb2Nlc3NcbiAqIEBwYXJhbSBiaW5kaW5nc1N0YXJ0SW5kZXggTG9jYXRpb24gb2YgdGhlIGZpcnN0IGDJtcm1aTE4bkFwcGx5YFxuICogQHBhcmFtIGNoYW5nZU1hc2sgRWFjaCBiaXQgY29ycmVzcG9uZHMgdG8gYSBgybXJtWkxOG5FeHBgIChDb3VudGluZyBiYWNrd2FyZHMgZnJvbVxuICogICAgIGBiaW5kaW5nc1N0YXJ0SW5kZXhgKVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlVcGRhdGVPcENvZGVzKFxuICAgIHRWaWV3OiBUVmlldywgdEljdXM6IFRJY3VbXXxudWxsLCBsVmlldzogTFZpZXcsIHVwZGF0ZU9wQ29kZXM6IEkxOG5VcGRhdGVPcENvZGVzLFxuICAgIGJpbmRpbmdzU3RhcnRJbmRleDogbnVtYmVyLCBjaGFuZ2VNYXNrOiBudW1iZXIpIHtcbiAgbGV0IGNhc2VDcmVhdGVkID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlT3BDb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vIGJpdCBjb2RlIHRvIGNoZWNrIGlmIHdlIHNob3VsZCBhcHBseSB0aGUgbmV4dCB1cGRhdGVcbiAgICBjb25zdCBjaGVja0JpdCA9IHVwZGF0ZU9wQ29kZXNbaV0gYXMgbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBvcENvZGVzIHRvIHNraXAgdW50aWwgbmV4dCBzZXQgb2YgdXBkYXRlIGNvZGVzXG4gICAgY29uc3Qgc2tpcENvZGVzID0gdXBkYXRlT3BDb2Rlc1srK2ldIGFzIG51bWJlcjtcbiAgICBpZiAoY2hlY2tCaXQgJiBjaGFuZ2VNYXNrKSB7XG4gICAgICAvLyBUaGUgdmFsdWUgaGFzIGJlZW4gdXBkYXRlZCBzaW5jZSBsYXN0IGNoZWNrZWRcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDw9IChpICsgc2tpcENvZGVzKTsgaisrKSB7XG4gICAgICAgIGNvbnN0IG9wQ29kZSA9IHVwZGF0ZU9wQ29kZXNbal07XG4gICAgICAgIGlmICh0eXBlb2Ygb3BDb2RlID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFsdWUgKz0gb3BDb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcENvZGUgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICBpZiAob3BDb2RlIDwgMCkge1xuICAgICAgICAgICAgLy8gTmVnYXRpdmUgb3BDb2RlIHJlcHJlc2VudCBgaTE4bkV4cGAgdmFsdWVzIG9mZnNldC5cbiAgICAgICAgICAgIHZhbHVlICs9IHJlbmRlclN0cmluZ2lmeShsVmlld1tiaW5kaW5nc1N0YXJ0SW5kZXggLSBvcENvZGVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gb3BDb2RlID4+PiBJMThuVXBkYXRlT3BDb2RlLlNISUZUX1JFRjtcbiAgICAgICAgICAgIHN3aXRjaCAob3BDb2RlICYgSTE4blVwZGF0ZU9wQ29kZS5NQVNLX09QQ09ERSkge1xuICAgICAgICAgICAgICBjYXNlIEkxOG5VcGRhdGVPcENvZGUuQXR0cjpcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHVwZGF0ZU9wQ29kZXNbKytqXSBhcyBzdHJpbmc7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2FuaXRpemVGbiA9IHVwZGF0ZU9wQ29kZXNbKytqXSBhcyBTYW5pdGl6ZXJGbiB8IG51bGw7XG4gICAgICAgICAgICAgICAgZWxlbWVudFByb3BlcnR5SW50ZXJuYWwoXG4gICAgICAgICAgICAgICAgICAgIHRWaWV3LCBnZXRUTm9kZSh0Vmlldywgbm9kZUluZGV4KSwgbFZpZXcsIHByb3BOYW1lLCB2YWx1ZSwgbFZpZXdbUkVOREVSRVJdLFxuICAgICAgICAgICAgICAgICAgICBzYW5pdGl6ZUZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgSTE4blVwZGF0ZU9wQ29kZS5UZXh0OlxuICAgICAgICAgICAgICAgIHRleHRCaW5kaW5nSW50ZXJuYWwobFZpZXcsIG5vZGVJbmRleCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIEkxOG5VcGRhdGVPcENvZGUuSWN1U3dpdGNoOlxuICAgICAgICAgICAgICAgIGNhc2VDcmVhdGVkID1cbiAgICAgICAgICAgICAgICAgICAgYXBwbHlJY3VTd2l0Y2hDYXNlKHRWaWV3LCB0SWN1cyEsIHVwZGF0ZU9wQ29kZXNbKytqXSBhcyBudW1iZXIsIGxWaWV3LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgSTE4blVwZGF0ZU9wQ29kZS5JY3VVcGRhdGU6XG4gICAgICAgICAgICAgICAgYXBwbHlJY3VVcGRhdGVDYXNlKFxuICAgICAgICAgICAgICAgICAgICB0VmlldywgdEljdXMhLCB1cGRhdGVPcENvZGVzWysral0gYXMgbnVtYmVyLCBiaW5kaW5nc1N0YXJ0SW5kZXgsIGxWaWV3LFxuICAgICAgICAgICAgICAgICAgICBjYXNlQ3JlYXRlZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGkgKz0gc2tpcENvZGVzO1xuICB9XG59XG5cbi8qKlxuICogQXBwbHkgT3BDb2RlcyBhc3NvY2lhdGVkIHdpdGggdXBkYXRpbmcgYW4gZXhpc3RpbmcgSUNVLlxuICpcbiAqIEBwYXJhbSB0VmlldyBDdXJyZW50IGBUVmlld2BcbiAqIEBwYXJhbSB0SWN1cyBJQ1VzIGFjdGl2ZSBhdCB0aGlzIGxvY2F0aW9uLlxuICogQHBhcmFtIHRJY3VJbmRleCBJbmRleCBpbnRvIGB0SWN1c2AgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSBiaW5kaW5nc1N0YXJ0SW5kZXggTG9jYXRpb24gb2YgdGhlIGZpcnN0IGDJtcm1aTE4bkFwcGx5YFxuICogQHBhcmFtIGxWaWV3IEN1cnJlbnQgYExWaWV3YFxuICogQHBhcmFtIGNoYW5nZU1hc2sgRWFjaCBiaXQgY29ycmVzcG9uZHMgdG8gYSBgybXJtWkxOG5FeHBgIChDb3VudGluZyBiYWNrd2FyZHMgZnJvbVxuICogICAgIGBiaW5kaW5nc1N0YXJ0SW5kZXhgKVxuICovXG5mdW5jdGlvbiBhcHBseUljdVVwZGF0ZUNhc2UoXG4gICAgdFZpZXc6IFRWaWV3LCB0SWN1czogVEljdVtdLCB0SWN1SW5kZXg6IG51bWJlciwgYmluZGluZ3NTdGFydEluZGV4OiBudW1iZXIsIGxWaWV3OiBMVmlldyxcbiAgICBjYXNlQ3JlYXRlZDogYm9vbGVhbikge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SW5kZXhJblJhbmdlKHRJY3VzLCB0SWN1SW5kZXgpO1xuICBjb25zdCB0SWN1ID0gdEljdXNbdEljdUluZGV4XTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEluZGV4SW5SYW5nZShsVmlldywgdEljdS5jdXJyZW50Q2FzZUxWaWV3SW5kZXgpO1xuICBjb25zdCBhY3RpdmVDYXNlSW5kZXggPSBsVmlld1t0SWN1LmN1cnJlbnRDYXNlTFZpZXdJbmRleF07XG4gIGlmIChhY3RpdmVDYXNlSW5kZXggIT09IG51bGwpIHtcbiAgICBjb25zdCBtYXNrID0gY2FzZUNyZWF0ZWQgP1xuICAgICAgICAtMSA6ICAvLyAtMSBpcyBzYW1lIGFzIGFsbCBiaXRzIG9uLCB3aGljaCBzaW11bGF0ZXMgY3JlYXRpb24gc2luY2UgaXQgbWFya3MgYWxsIGJpdHMgZGlydHlcbiAgICAgICAgY2hhbmdlTWFzaztcbiAgICBhcHBseVVwZGF0ZU9wQ29kZXModFZpZXcsIHRJY3VzLCBsVmlldywgdEljdS51cGRhdGVbYWN0aXZlQ2FzZUluZGV4XSwgYmluZGluZ3NTdGFydEluZGV4LCBtYXNrKTtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGx5IE9wQ29kZXMgYXNzb2NpYXRlZCB3aXRoIHN3aXRjaGluZyBhIGNhc2Ugb24gSUNVLlxuICpcbiAqIFRoaXMgaW52b2x2ZXMgdGVhcmluZyBkb3duIGV4aXN0aW5nIGNhc2UgYW5kIHRoYW4gYnVpbGRpbmcgdXAgYSBuZXcgY2FzZS5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgQ3VycmVudCBgVFZpZXdgXG4gKiBAcGFyYW0gdEljdXMgSUNVcyBhY3RpdmUgYXQgdGhpcyBsb2NhdGlvbi5cbiAqIEBwYXJhbSB0SUN1SW5kZXggSW5kZXggaW50byBgdEljdXNgIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0gbFZpZXcgQ3VycmVudCBgTFZpZXdgXG4gKiBAcGFyYW0gdmFsdWUgVmFsdWUgb2YgdGhlIGNhc2UgdG8gdXBkYXRlIHRvLlxuICogQHJldHVybnMgdHJ1ZSBpZiBhIG5ldyBjYXNlIHdhcyBjcmVhdGVkIChuZWVkZWQgc28gdGhhdCB0aGUgdXBkYXRlIGV4ZWN1dGVzIHJlZ2FyZGxlc3Mgb2YgdGhlXG4gKiAgICAgYml0bWFzaylcbiAqL1xuZnVuY3Rpb24gYXBwbHlJY3VTd2l0Y2hDYXNlKFxuICAgIHRWaWV3OiBUVmlldywgdEljdXM6IFRJY3VbXSwgdElDdUluZGV4OiBudW1iZXIsIGxWaWV3OiBMVmlldywgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBhcHBseUljdVN3aXRjaENhc2VSZW1vdmUodFZpZXcsIHRJY3VzLCB0SUN1SW5kZXgsIGxWaWV3KTtcblxuICAvLyBSZWJ1aWxkIGEgbmV3IGNhc2UgZm9yIHRoaXMgSUNVXG4gIGxldCBjYXNlQ3JlYXRlZCA9IGZhbHNlO1xuICBjb25zdCB0SWN1ID0gdEljdXNbdElDdUluZGV4XTtcbiAgY29uc3QgY2FzZUluZGV4ID0gZ2V0Q2FzZUluZGV4KHRJY3UsIHZhbHVlKTtcbiAgbFZpZXdbdEljdS5jdXJyZW50Q2FzZUxWaWV3SW5kZXhdID0gY2FzZUluZGV4ICE9PSAtMSA/IGNhc2VJbmRleCA6IG51bGw7XG4gIGlmIChjYXNlSW5kZXggPiAtMSkge1xuICAgIC8vIEFkZCB0aGUgbm9kZXMgZm9yIHRoZSBuZXcgY2FzZVxuICAgIGFwcGx5Q3JlYXRlT3BDb2RlcyhcbiAgICAgICAgdFZpZXcsIC0xLCAgLy8gLTEgbWVhbnMgd2UgZG9uJ3QgaGF2ZSBwYXJlbnQgbm9kZVxuICAgICAgICB0SWN1LmNyZWF0ZVtjYXNlSW5kZXhdLCBsVmlldyk7XG4gICAgY2FzZUNyZWF0ZWQgPSB0cnVlO1xuICB9XG4gIHJldHVybiBjYXNlQ3JlYXRlZDtcbn1cblxuLyoqXG4gKiBBcHBseSBPcENvZGVzIGFzc29jaWF0ZWQgd2l0aCB0ZWFyaW5nIGRvd24gb2YgRE9NLlxuICpcbiAqIFRoaXMgaW52b2x2ZXMgdGVhcmluZyBkb3duIGV4aXN0aW5nIGNhc2UgYW5kIHRoYW4gYnVpbGRpbmcgdXAgYSBuZXcgY2FzZS5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgQ3VycmVudCBgVFZpZXdgXG4gKiBAcGFyYW0gdEljdXMgSUNVcyBhY3RpdmUgYXQgdGhpcyBsb2NhdGlvbi5cbiAqIEBwYXJhbSB0SWN1SW5kZXggSW5kZXggaW50byBgdEljdXNgIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0gbFZpZXcgQ3VycmVudCBgTFZpZXdgXG4gKiBAcmV0dXJucyB0cnVlIGlmIGEgbmV3IGNhc2Ugd2FzIGNyZWF0ZWQgKG5lZWRlZCBzbyB0aGF0IHRoZSB1cGRhdGUgZXhlY3V0ZXMgcmVnYXJkbGVzcyBvZiB0aGVcbiAqICAgICBiaXRtYXNrKVxuICovXG5mdW5jdGlvbiBhcHBseUljdVN3aXRjaENhc2VSZW1vdmUodFZpZXc6IFRWaWV3LCB0SWN1czogVEljdVtdLCB0SWN1SW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3KSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UodEljdXMsIHRJY3VJbmRleCk7XG4gIGNvbnN0IHRJY3UgPSB0SWN1c1t0SWN1SW5kZXhdO1xuICBjb25zdCBhY3RpdmVDYXNlSW5kZXggPSBsVmlld1t0SWN1LmN1cnJlbnRDYXNlTFZpZXdJbmRleF07XG4gIGlmIChhY3RpdmVDYXNlSW5kZXggIT09IG51bGwpIHtcbiAgICBjb25zdCByZW1vdmVDb2RlcyA9IHRJY3UucmVtb3ZlW2FjdGl2ZUNhc2VJbmRleF07XG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmVDb2Rlcy5sZW5ndGg7IGsrKykge1xuICAgICAgY29uc3QgcmVtb3ZlT3BDb2RlID0gcmVtb3ZlQ29kZXNba10gYXMgbnVtYmVyO1xuICAgICAgY29uc3Qgbm9kZU9ySWN1SW5kZXggPSByZW1vdmVPcENvZGUgPj4+IEkxOG5NdXRhdGVPcENvZGUuU0hJRlRfUkVGO1xuICAgICAgc3dpdGNoIChyZW1vdmVPcENvZGUgJiBJMThuTXV0YXRlT3BDb2RlLk1BU0tfSU5TVFJVQ1RJT04pIHtcbiAgICAgICAgY2FzZSBJMThuTXV0YXRlT3BDb2RlLlJlbW92ZTpcbiAgICAgICAgICAvLyBGSVhNRShtaXNrbyk6IHRoaXMgY29tbWVudCBpcyB3cm9uZyFcbiAgICAgICAgICAvLyBSZW1vdmUgRE9NIGVsZW1lbnQsIGJ1dCBkbyAqbm90KiBtYXJrIFROb2RlIGFzIGRldGFjaGVkLCBzaW5jZSB3ZSBhcmVcbiAgICAgICAgICAvLyBqdXN0IHN3aXRjaGluZyBJQ1UgY2FzZXMgKHdoaWxlIGtlZXBpbmcgdGhlIHNhbWUgVE5vZGUpLCBzbyBhIERPTSBlbGVtZW50XG4gICAgICAgICAgLy8gcmVwcmVzZW50aW5nIGEgbmV3IElDVSBjYXNlIHdpbGwgYmUgcmUtY3JlYXRlZC5cbiAgICAgICAgICByZW1vdmVOb2RlKHRWaWV3LCBsVmlldywgbm9kZU9ySWN1SW5kZXgsIC8qIG1hcmtBc0RldGFjaGVkICovIGZhbHNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBJMThuTXV0YXRlT3BDb2RlLlJlbW92ZU5lc3RlZEljdTpcbiAgICAgICAgICBhcHBseUljdVN3aXRjaENhc2VSZW1vdmUodFZpZXcsIHRJY3VzLCBub2RlT3JJY3VJbmRleCwgbFZpZXcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmRJMThuTm9kZShcbiAgICB0VmlldzogVFZpZXcsIHROb2RlOiBUTm9kZSwgcGFyZW50VE5vZGU6IFROb2RlLCBwcmV2aW91c1ROb2RlOiBUTm9kZXxudWxsLFxuICAgIGxWaWV3OiBMVmlldyk6IFROb2RlIHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlck1vdmVOb2RlKys7XG4gIGNvbnN0IG5leHROb2RlID0gdE5vZGUubmV4dDtcbiAgaWYgKCFwcmV2aW91c1ROb2RlKSB7XG4gICAgcHJldmlvdXNUTm9kZSA9IHBhcmVudFROb2RlO1xuICB9XG5cbiAgLy8gUmUtb3JnYW5pemUgbm9kZSB0cmVlIHRvIHB1dCB0aGlzIG5vZGUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24uXG4gIGlmIChwcmV2aW91c1ROb2RlID09PSBwYXJlbnRUTm9kZSAmJiB0Tm9kZSAhPT0gcGFyZW50VE5vZGUuY2hpbGQpIHtcbiAgICB0Tm9kZS5uZXh0ID0gcGFyZW50VE5vZGUuY2hpbGQ7XG4gICAgLy8gRklYTUUobWlza28pOiBDaGVja2luZyBgdE5vZGUucGFyZW50YCBpcyBhIHRlbXBvcmFyeSB3b3JrYXJvdW5kIHVudGlsIHdlIHByb3Blcmx5XG4gICAgLy8gcmVmYWN0b3IgdGhlIGkxOG4gY29kZSBpbiAjMzg3MDcgYW5kIHRoaXMgY29kZSB3aWxsIGJlIGRlbGV0ZWQuXG4gICAgaWYgKHROb2RlLnBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgdFZpZXcuZmlyc3RDaGlsZCA9IHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRUTm9kZS5jaGlsZCA9IHROb2RlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChwcmV2aW91c1ROb2RlICE9PSBwYXJlbnRUTm9kZSAmJiB0Tm9kZSAhPT0gcHJldmlvdXNUTm9kZS5uZXh0KSB7XG4gICAgdE5vZGUubmV4dCA9IHByZXZpb3VzVE5vZGUubmV4dDtcbiAgICBwcmV2aW91c1ROb2RlLm5leHQgPSB0Tm9kZTtcbiAgfSBlbHNlIHtcbiAgICB0Tm9kZS5uZXh0ID0gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXJlbnRUTm9kZSAhPT0gbFZpZXdbVF9IT1NUXSkge1xuICAgIHROb2RlLnBhcmVudCA9IHBhcmVudFROb2RlIGFzIFRFbGVtZW50Tm9kZTtcbiAgfVxuXG4gIC8vIElmIHROb2RlIHdhcyBtb3ZlZCBhcm91bmQsIHdlIG1pZ2h0IG5lZWQgdG8gZml4IGEgYnJva2VuIGxpbmsuXG4gIGxldCBjdXJzb3I6IFROb2RlfG51bGwgPSB0Tm9kZS5uZXh0O1xuICB3aGlsZSAoY3Vyc29yKSB7XG4gICAgaWYgKGN1cnNvci5uZXh0ID09PSB0Tm9kZSkge1xuICAgICAgY3Vyc29yLm5leHQgPSBuZXh0Tm9kZTtcbiAgICB9XG4gICAgY3Vyc29yID0gY3Vyc29yLm5leHQ7XG4gIH1cblxuICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgdG8gYXBwZW5kIGlzIGEgcHJvamVjdGlvbiwgd2UgbmVlZCB0byBtb3ZlIHRoZSBwcm9qZWN0ZWQgbm9kZXMgaW5zdGVhZFxuICBpZiAodE5vZGUudHlwZSA9PT0gVE5vZGVUeXBlLlByb2plY3Rpb24pIHtcbiAgICBhcHBseVByb2plY3Rpb24odFZpZXcsIGxWaWV3LCB0Tm9kZSBhcyBUUHJvamVjdGlvbk5vZGUpO1xuICAgIHJldHVybiB0Tm9kZTtcbiAgfVxuXG4gIGFwcGVuZENoaWxkKHRWaWV3LCBsVmlldywgZ2V0TmF0aXZlQnlUTm9kZSh0Tm9kZSwgbFZpZXcpLCB0Tm9kZSk7XG5cbiAgY29uc3Qgc2xvdFZhbHVlID0gbFZpZXdbdE5vZGUuaW5kZXhdO1xuICBpZiAodE5vZGUudHlwZSAhPT0gVE5vZGVUeXBlLkNvbnRhaW5lciAmJiBpc0xDb250YWluZXIoc2xvdFZhbHVlKSkge1xuICAgIC8vIE5vZGVzIHRoYXQgaW5qZWN0IFZpZXdDb250YWluZXJSZWYgYWxzbyBoYXZlIGEgY29tbWVudCBub2RlIHRoYXQgc2hvdWxkIGJlIG1vdmVkXG4gICAgYXBwZW5kQ2hpbGQodFZpZXcsIGxWaWV3LCBzbG90VmFsdWVbTkFUSVZFXSwgdE5vZGUpO1xuICB9XG4gIHJldHVybiB0Tm9kZTtcbn1cblxuLyoqXG4gKiBTZWUgYGkxOG5FbmRgIGFib3ZlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaTE4bkVuZEZpcnN0UGFzcyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldykge1xuICBuZ0Rldk1vZGUgJiZcbiAgICAgIGFzc2VydEVxdWFsKFxuICAgICAgICAgIGdldEJpbmRpbmdJbmRleCgpLCB0Vmlldy5iaW5kaW5nU3RhcnRJbmRleCxcbiAgICAgICAgICAnaTE4bkVuZCBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhbnkgYmluZGluZycpO1xuXG4gIGNvbnN0IHJvb3RJbmRleCA9IHBvcEkxOG5JbmRleCgpO1xuICBjb25zdCB0STE4biA9IHRWaWV3LmRhdGFbcm9vdEluZGV4ICsgSEVBREVSX09GRlNFVF0gYXMgVEkxOG47XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKHRJMThuLCBgWW91IHNob3VsZCBjYWxsIGkxOG5TdGFydCBiZWZvcmUgaTE4bkVuZGApO1xuXG4gIC8vIEZpbmQgdGhlIGxhc3Qgbm9kZSB0aGF0IHdhcyBhZGRlZCBiZWZvcmUgYGkxOG5FbmRgXG4gIGNvbnN0IGxhc3RDcmVhdGVkTm9kZSA9IGdldEN1cnJlbnRUTm9kZSgpO1xuXG4gIC8vIFJlYWQgdGhlIGluc3RydWN0aW9ucyB0byBpbnNlcnQvbW92ZS9yZW1vdmUgRE9NIGVsZW1lbnRzXG4gIGNvbnN0IHZpc2l0ZWROb2RlcyA9IGFwcGx5Q3JlYXRlT3BDb2Rlcyh0Vmlldywgcm9vdEluZGV4LCB0STE4bi5jcmVhdGUsIGxWaWV3KTtcblxuICAvLyBSZW1vdmUgZGVsZXRlZCBub2Rlc1xuICBsZXQgaW5kZXggPSByb290SW5kZXggKyAxO1xuICB3aGlsZSAobGFzdENyZWF0ZWROb2RlICE9PSBudWxsICYmIGluZGV4IDw9IGxhc3RDcmVhdGVkTm9kZS5pbmRleCAtIEhFQURFUl9PRkZTRVQpIHtcbiAgICBpZiAodmlzaXRlZE5vZGVzLmluZGV4T2YoaW5kZXgpID09PSAtMSkge1xuICAgICAgcmVtb3ZlTm9kZSh0VmlldywgbFZpZXcsIGluZGV4LCAvKiBtYXJrQXNEZXRhY2hlZCAqLyB0cnVlKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgYW4gZWxlbWVudCBoYXMgYW55IGxvY2FsIHJlZnMgYW5kIHNraXAgdGhlbVxuICAgIGNvbnN0IHROb2RlID0gZ2V0VE5vZGUodFZpZXcsIGluZGV4KTtcbiAgICBpZiAodE5vZGUgJiZcbiAgICAgICAgKHROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5Db250YWluZXIgfHwgdE5vZGUudHlwZSA9PT0gVE5vZGVUeXBlLkVsZW1lbnQgfHxcbiAgICAgICAgIHROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5FbGVtZW50Q29udGFpbmVyKSAmJlxuICAgICAgICB0Tm9kZS5sb2NhbE5hbWVzICE9PSBudWxsKSB7XG4gICAgICAvLyBEaXZpZGUgYnkgMiB0byBnZXQgdGhlIG51bWJlciBvZiBsb2NhbCByZWZzLFxuICAgICAgLy8gc2luY2UgdGhleSBhcmUgc3RvcmVkIGFzIGFuIGFycmF5IHRoYXQgYWxzbyBpbmNsdWRlcyBkaXJlY3RpdmUgaW5kZXhlcyxcbiAgICAgIC8vIGkuZS4gW1wibG9jYWxSZWZcIiwgZGlyZWN0aXZlSW5kZXgsIC4uLl1cbiAgICAgIGluZGV4ICs9IHROb2RlLmxvY2FsTmFtZXMubGVuZ3RoID4+IDE7XG4gICAgfVxuICAgIGluZGV4Kys7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTm9kZSh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgaW5kZXg6IG51bWJlciwgbWFya0FzRGV0YWNoZWQ6IGJvb2xlYW4pIHtcbiAgY29uc3QgcmVtb3ZlZFBoVE5vZGUgPSBnZXRUTm9kZSh0VmlldywgaW5kZXgpO1xuICBjb25zdCByZW1vdmVkUGhSTm9kZSA9IGdldE5hdGl2ZUJ5SW5kZXgoaW5kZXgsIGxWaWV3KTtcbiAgaWYgKHJlbW92ZWRQaFJOb2RlKSB7XG4gICAgbmF0aXZlUmVtb3ZlTm9kZShsVmlld1tSRU5ERVJFUl0sIHJlbW92ZWRQaFJOb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHNsb3RWYWx1ZSA9IGxvYWQobFZpZXcsIGluZGV4KSBhcyBSRWxlbWVudCB8IFJDb21tZW50IHwgTENvbnRhaW5lcjtcbiAgaWYgKGlzTENvbnRhaW5lcihzbG90VmFsdWUpKSB7XG4gICAgY29uc3QgbENvbnRhaW5lciA9IHNsb3RWYWx1ZSBhcyBMQ29udGFpbmVyO1xuICAgIGlmIChyZW1vdmVkUGhUTm9kZS50eXBlICE9PSBUTm9kZVR5cGUuQ29udGFpbmVyKSB7XG4gICAgICBuYXRpdmVSZW1vdmVOb2RlKGxWaWV3W1JFTkRFUkVSXSwgbENvbnRhaW5lcltOQVRJVkVdKTtcbiAgICB9XG4gIH1cblxuICBpZiAobWFya0FzRGV0YWNoZWQgJiYgcmVtb3ZlZFBoVE5vZGUpIHtcbiAgICAvLyBEZWZpbmUgdGhpcyBub2RlIGFzIGRldGFjaGVkIHRvIGF2b2lkIHByb2plY3RpbmcgaXQgbGF0ZXJcbiAgICByZW1vdmVkUGhUTm9kZS5mbGFncyB8PSBUTm9kZUZsYWdzLmlzRGV0YWNoZWQ7XG4gIH1cbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclJlbW92ZU5vZGUrKztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBzdG9yZXMgdGhlIGR5bmFtaWMgVE5vZGUsIGFuZCB1bmhvb2tzIGl0IGZyb20gdGhlIHRyZWUgZm9yIG5vdy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRHluYW1pY05vZGVBdEluZGV4KFxuICAgIHRWaWV3OiBUVmlldywgbFZpZXc6IExWaWV3LCBpbmRleDogbnVtYmVyLCB0eXBlOiBUTm9kZVR5cGUsIG5hdGl2ZTogUkVsZW1lbnR8UlRleHR8bnVsbCxcbiAgICBuYW1lOiBzdHJpbmd8bnVsbCk6IFRFbGVtZW50Tm9kZXxUSWN1Q29udGFpbmVyTm9kZSB7XG4gIGNvbnN0IGN1cnJlbnRUTm9kZSA9IGdldEN1cnJlbnRUTm9kZSgpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SW5kZXhJblJhbmdlKGxWaWV3LCBpbmRleCArIEhFQURFUl9PRkZTRVQpO1xuICBsVmlld1tpbmRleCArIEhFQURFUl9PRkZTRVRdID0gbmF0aXZlO1xuICAvLyBGSVhNRShtaXNrbyk6IFdoeSBkb2VzIHRoaXMgY3JlYXRlIEEgVE5vZGU/Pz8gSSB3b3VsZCBub3QgZXhwZWN0IHRoaXMgdG8gYmUgaGVyZS5cbiAgY29uc3QgdE5vZGUgPSBnZXRPckNyZWF0ZVROb2RlKHRWaWV3LCBpbmRleCwgdHlwZSBhcyBhbnksIG5hbWUsIG51bGwpO1xuXG4gIC8vIFdlIGFyZSBjcmVhdGluZyBhIGR5bmFtaWMgbm9kZSwgdGhlIHByZXZpb3VzIHROb2RlIG1pZ2h0IG5vdCBiZSBwb2ludGluZyBhdCB0aGlzIG5vZGUuXG4gIC8vIFdlIHdpbGwgbGluayBvdXJzZWx2ZXMgaW50byB0aGUgdHJlZSBsYXRlciB3aXRoIGBhcHBlbmRJMThuTm9kZWAuXG4gIGlmIChjdXJyZW50VE5vZGUgJiYgY3VycmVudFROb2RlLm5leHQgPT09IHROb2RlKSB7XG4gICAgY3VycmVudFROb2RlLm5leHQgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHROb2RlO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2FzZSBvZiBhbiBJQ1UgZXhwcmVzc2lvbiBkZXBlbmRpbmcgb24gdGhlIG1haW4gYmluZGluZyB2YWx1ZVxuICpcbiAqIEBwYXJhbSBpY3VFeHByZXNzaW9uXG4gKiBAcGFyYW0gYmluZGluZ1ZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgbWFpbiBiaW5kaW5nIHVzZWQgYnkgdGhpcyBJQ1UgZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBnZXRDYXNlSW5kZXgoaWN1RXhwcmVzc2lvbjogVEljdSwgYmluZGluZ1ZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICBsZXQgaW5kZXggPSBpY3VFeHByZXNzaW9uLmNhc2VzLmluZGV4T2YoYmluZGluZ1ZhbHVlKTtcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHN3aXRjaCAoaWN1RXhwcmVzc2lvbi50eXBlKSB7XG4gICAgICBjYXNlIEljdVR5cGUucGx1cmFsOiB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkQ2FzZSA9IGdldFBsdXJhbENhc2UoYmluZGluZ1ZhbHVlLCBnZXRMb2NhbGVJZCgpKTtcbiAgICAgICAgaW5kZXggPSBpY3VFeHByZXNzaW9uLmNhc2VzLmluZGV4T2YocmVzb2x2ZWRDYXNlKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSAmJiByZXNvbHZlZENhc2UgIT09ICdvdGhlcicpIHtcbiAgICAgICAgICBpbmRleCA9IGljdUV4cHJlc3Npb24uY2FzZXMuaW5kZXhPZignb3RoZXInKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgSWN1VHlwZS5zZWxlY3Q6IHtcbiAgICAgICAgaW5kZXggPSBpY3VFeHByZXNzaW9uLmNhc2VzLmluZGV4T2YoJ290aGVyJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaW5kZXg7XG59XG4iXX0=