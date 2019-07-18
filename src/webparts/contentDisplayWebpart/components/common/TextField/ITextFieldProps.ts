
export interface ITextFieldProps {
    onChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
    label: string;
    value:string;
    validate:(value:string) => Promise<string>
}