

export default class LocalStorageHelper {

    public static setItem(key, item): void {
        localStorage.setItem(key, JSON.stringify(item));
    }

    public static getItem(key): any | any[] {
        return JSON.parse(localStorage.getItem(key));
    }

    public static clearAll(): void {
        localStorage.clear();
    }

    public static removeItem(key):void{
        localStorage.removeItem(key);
    }
}