function addZero(i): string {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

export function init(Survey: any): void {
    const widget = {
        name: 'custom-widget',
        widgetIsLoaded(): boolean {
            return true;
        },
        isFit(question): any {
            return true;
        },
        init(): void {
            Survey.Serializer.addProperty('question', {
                name: 'tooltip:text',
                category: 'general'
            });
        },
        isDefaultRender: true,
        afterRender(question, el): void {
            if (question.value && ['date', 'datetime', 'datetime-local', 'time'].includes(question.inputType)) {
                const date = new Date(question.value);
                const year = date.getFullYear();
                const month = addZero(date.getMonth() + 1);
                const day = addZero(date.getDate());
                const hour = addZero(date.getUTCHours());
                const minutes = addZero(date.getUTCMinutes());
                switch (question.inputType) {
                    case 'date':
                        question.value = `${year}-${month}-${day}`;
                        break;
                    case 'datetime':
                        break;
                    case 'datetime-local':
                        question.value = `${year}-${month}-${day}T${hour}:${minutes}`;
                        break;
                    case 'time':
                        question.value = `${hour}:${minutes}`;
                        break;
                    default:
                        break;
                }
                el.value = question.value;
            }
            if (question.tooltip) {
                const header = el.parentElement.parentElement.querySelector('h5');
                if (header) {
                    header.title = question.tooltip;
                    const span = document.createElement('span');
                    span.innerText = 'info';
                    span.className = 'material-icons';
                    span.style.fontSize = '1em';
                    span.style.cursor = 'pointer';
                    header.appendChild(span);
                }
            }
        }
    };
    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customwidget');
}
