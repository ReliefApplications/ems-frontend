export function init(Survey: any): void {
    const tooltipWidget = {
        name: 'tooltip-widget',
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
    Survey.CustomWidgetCollection.Instance.addCustomWidget(tooltipWidget, 'tooltip');
}
