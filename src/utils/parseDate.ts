export const parsePublishedAt = (publishedAt: string) => {
    const now = new Date();
    let timeDelta = 0;

    if (publishedAt.includes("tydzień") || publishedAt.includes("tygodni")) {
        const weeks = parseInt(publishedAt.match(/\d+/)?.[0] || "0", 10);
        timeDelta = weeks * 7 * 24 * 60 * 60 * 1000;
    } else if (publishedAt.includes("dzień") || publishedAt.includes("dni")) {
        const days = parseInt(publishedAt.match(/\d+/)?.[0] || "0", 10);
        timeDelta = days * 24 * 60 * 60 * 1000;
    } else if (publishedAt.includes("godzinę") || publishedAt.includes("godzin")) {
        const hours = parseInt(publishedAt.match(/\d+/)?.[0] || "1", 10);
        timeDelta = hours * 60 * 60 * 1000;
    } else if (publishedAt.includes("wczoraj") || publishedAt.includes("wczoru")) {
        timeDelta = 1 * 24 * 60 * 60 * 1000;
    }

    return now.getTime() - timeDelta;
};
