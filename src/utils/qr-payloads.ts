/**
 * Utility functions to generate QR code payload strings for static types.
 */

export const generateWifiPayload = (ssid: string, password?: string, encryption: 'WPA' | 'WEP' | 'nopass' = 'WPA', hidden: boolean = false) => {
    // Format: WIFI:T:WPA;S:mynetwork;P:mypass;;
    // Special chars in SSID/Pass need escaping with backslash: \ ; , : "
    const escape = (str: string) => str.replace(/([\\;,":])/g, '\\$1');

    let payload = `WIFI:T:${encryption};S:${escape(ssid)};`;
    if (encryption !== 'nopass' && password) {
        payload += `P:${escape(password)};`;
    }
    if (hidden) {
        payload += `H:true;`;
    }
    payload += ';';
    return payload;
};

export const generateVCardPayload = (
    firstName: string,
    lastName: string,
    phone?: string,
    email?: string,
    org?: string,
    website?: string,
    title?: string
) => {
    // VCARD 3.0 format
    let payload = `BEGIN:VCARD\nVERSION:3.0\n`;
    payload += `N:${lastName};${firstName};;;\n`;
    payload += `FN:${firstName} ${lastName}\n`;
    if (org) payload += `ORG:${org}\n`;
    if (title) payload += `TITLE:${title}\n`;
    if (phone) payload += `TEL;TYPE=CELL:${phone}\n`;
    if (email) payload += `EMAIL:${email}\n`;
    if (website) payload += `URL:${website}\n`;
    payload += `END:VCARD`;
    return payload;
};

export const generateEmailPayload = (to: string, subject?: string, body?: string) => {
    let payload = `mailto:${to}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) {
        payload += `?${params.join('&')}`;
    }
    return payload;
};

export const generateSmsPayload = (phone: string, message?: string) => {
    // SMSTO:format is widely supported
    return `SMSTO:${phone}:${message || ''}`;
};

export const generateEventPayload = (title: string, start: Date, end: Date, location?: string, description?: string) => {
    // iCalendar format
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let payload = `BEGIN:VEVENT\n`;
    payload += `SUMMARY:${title}\n`;
    payload += `DTSTART:${formatDate(start)}\n`;
    payload += `DTEND:${formatDate(end)}\n`;
    if (location) payload += `LOCATION:${location}\n`;
    if (description) payload += `DESCRIPTION:${description}\n`;
    payload += `END:VEVENT`;
    return payload;
};

export const generateGeoPayload = (lat: number, lng: number) => {
    return `geo:${lat},${lng}`;
};
