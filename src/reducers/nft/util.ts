export const chunkArray = (arr: any[], len: number) => {
    const chunks: any[] = [];
    const n = arr.length;

    let i = 0;
    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
};
