export const extractDomain = (url: string): string => {
    try {
        const urlObject = new URL(url)
        return urlObject.hostname
    } catch {
        return 'exemplo.com.br'
    }
}