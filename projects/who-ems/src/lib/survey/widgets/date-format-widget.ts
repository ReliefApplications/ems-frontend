function addZero(i): string {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

export function init(Survey: any): void {
    const widget = {
        name: 'date-format-widget',
        title: 'Date Format Widget',
        isFit(question): any {
            return ['date', 'datetime', 'datetime-local', 'time'].includes(question.inputType);
        },
        isDefaultRender: true,
        afterRender(question, el): void {
            if (question.value) {
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
        }
    };
    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
}
