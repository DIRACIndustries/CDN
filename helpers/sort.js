
const compare = (a, b, isAsc) => {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
};


export const sort = function(args) {
    let data = args.data;
    let key = args.orderBy;
    let isAsc = args.isAsc || true;
    if (key[0] == "-") {
        isAsc = false;
        key = key.slice(1);
    }
    data.sort(function(a, b) {
        return compare(a[key], b[key], isAsc);
    })
    return data;
}