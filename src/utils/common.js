'use strict';
import * as datetime from './datetime';
export function filtersTowhereCauses(filters, colFilter) {
    let whereCauses = [];
    if (filters) {
        Object.keys(filters).map((name, i) => {
            const count = filters[name].count;
            const sign = filters[name].sign;
            let whereCause = { WhereItems: [], RelationSign: sign };
            for (let i = 0; i < count; i++) {
                const crName = 'cr_' + i;
                const cvName = 'cv_' + i;
                let vals = filters[name][cvName];
                if (!vals && filters[name][crName] !== 'null' && filters[name][crName] !== 'empty') {
                    continue;
                }
                if (vals instanceof Array) {
                    let vals2 = [];
                    for (let i = 0; i < vals.length; i++) {
                        if (vals[i].toDate) {
                            vals2.push(datetime.format(vals[i].toDate(), 'yyyy-MM-dd'));
                        } else {
                            vals2.push(vals[i]);
                        }
                    }
                    vals = vals2.join(',');
                }
                const whereItem = { FieldName: name, Operator: filters[name][crName], FieldValues: vals };
                whereCause.WhereItems.push(whereItem);
            }
            if (whereCause.WhereItems.length > 0) {
                whereCauses.push(whereCause);
            }
        });
    }
    if (colFilter) {
        let whereCause = { WhereItems: [], RelationSign: 'AND' };
        const whereItem = { FieldName: colFilter.name, Operator: '=', FieldValues: '' + colFilter.value };
        whereCause.WhereItems.push(whereItem);
        whereCauses.push(whereCause);
    }
    return whereCauses;
}
export function sorterToOrderItems(sorter) {
    let orderItems = [];
    if (sorter) {
        const fName = sorter.field ? sorter.field : sorter.columnKey;
        if (fName) {
            orderItems.push({
                FieldName: sorter.field ? sorter.field : sorter.columnKey,
                Direction: sorter.order === 'descend' ? 'DESC' : 'ASC',
            });
        }
    }
    return orderItems;
}
export function sorterToOrderItems2(sorter) {
    let order = {};
    if (sorter && sorter.column) {
        order[sorter.column.name] = sorter.order === 'descend' ? 'DESC' : 'ASC';
    }
    return order;
}

export function TosWxS(value) {
    var value = Math.round(parseFloat(value) * 1000) / 1000;
    var xsd = value.toString().split('.');
    if (xsd.length == 1) {
        value = xsd + '.000';
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = xsd + '00';
        }
        return value;
    }
}

export function formatMonth(month) {
    const ym = month.split('/');
    return '日期.时间.月.' + ym[0] + ym[1];
}

export function toThousands(num) {
    var num = (num || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}
export function formatNumber(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split('.');
    xsd[0] = toThousands(xsd[0]);
    if (xsd.length == 1) {
        value = xsd[0] + '.00';
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = xsd[0] + '.' + xsd[1] + '0';
        }
        return xsd[0] + '.' + xsd[1];
    }
}
