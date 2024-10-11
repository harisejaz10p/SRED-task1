/**
 * Fetch data from a URL using the Fetch API.
 * @param url - The URL to fetch data from.
 * @param method - The HTTP method to use for the request.
 * @param body - The request body to send with the request.
 * @param headers - Additional headers to include in the request.
 * @returns A promise that resolves to the parsed JSON response.
 */
export async function fetchData<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers: Record<string, string> = {},
): Promise<T> {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch API call failed:', error);
        throw error;
    }
}