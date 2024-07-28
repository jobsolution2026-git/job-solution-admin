import {toast} from "vue3-toastify";
import moment from "moment";
export const randomString = (length: number = 32): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

export const yearOptions = () => {
    let yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 3; i <= currentYear + 4; i++) {
        yearOptions.push(i);
    }
    return yearOptions;
}

export const groupOptions = () => {
    return [
        { label: 'Science', value: 'science' },
        { label: 'Commerce', value: 'commerce' },
        { label: 'Arts', value: 'arts' },
    ];
}

export const formatDateTime = (date: string, format: string = 'lll') => {
    return moment(date).format(format);
}

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const showToast = (type: string = 'info', message: string = 'success!') => {
    if (type === 'info') return toast.info(message);
    if (type === 'success') return toast.success(message);
    if (type === 'warning') return toast.warning(message);
    if (type === 'error') return toast.error(message);
}

export const formatErrors = (errors: any) => {
    const formattedErrors: any = {};
    for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
            let newKey = key;
            if (key.startsWith('exam.') || key.startsWith('note.') || key.startsWith('link.' || key.startsWith('live.'))|| key.startsWith('pdf.' || key.startsWith('video.'))|| key.startsWith('cq.')) {
                newKey = key.substring(key.indexOf('.') + 1);
            }
            formattedErrors[newKey] = errors[key];
        }
    }
    return formattedErrors;
};