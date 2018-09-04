
/********************************  Array Is prepared Here  *************************************************/
export function dataGrids(result) {
    let data = [];
    result.forEach(value => {
       data.push({
           id: value.plan_id,
           validity_display: checkValidity(value.validity),
           validity: value.validity,
           title: value.title,
           description: value.description,
           connectors:value.connectors,
           main_price: checkValue(value.custom_price, value.discount_type, value.discount, value.services_groups ),
           discount: value.discount,
           originalValue: value.custom_price !== ""?value.custom_price:checkIfNull(value.services_groups),
           services: createServices(value.services_groups),
       });
    });
    return data;
}
function checkValue(main, type, disc, service) {
    if ( main !== 0 && main !== '' && main !== undefined ) {
        if ( type === 'Fixed' ) {
            return main - disc;
        } else {
            return ( (100 - disc) * main ) / 100;
        }
    } else {
        let price = 0;
        Object.keys(service).map(keys => {
            Object.keys(service[keys].services).map(key1 => {
                if (service[keys].services[key1].charge_type.toLowerCase() === 'prepaid')
                   price = price + parseInt(service[keys].services[key1].prepaid.fixed_price) + parseInt(service[keys].services[key1].service_charge);
            });
        });
        if ( type === 'Fixed' ) {
            return price - disc;
        } else {
            return ( (100 - disc) * price ) / 100;
        }
    }
}
function createServices(result) {
    // let service = [];
    // result.forEach(data => {
    //     const title = data.title;
    //     const description = data.description;
    //
    // });
  return result;
}
function checkValidity(data) {
    if ( data <= '30' && data >= '28' ) {
        return '/month';
    } else if ( data === '365' || data === '366' ) {
        return '/annual';
    }
}
function checkIfNull(service) {
    let price = 0;
    Object.keys(service).map(keys => {
        Object.keys(service[keys].services).map(key1 => {
            if (service[keys].services[key1].charge_type.toLowerCase() === 'prepaid')
                price = price + parseInt(service[keys].services[key1].prepaid.fixed_price) + parseInt(service[keys].services[key1].service_charge);
        });
    });
    return price;
}
/*************************  Remove unselected Services  *******************************************/
export function RemoveService(arg, service) {
let val = [];
let arg2 = JSON.stringify(arg);
arg2 = JSON.parse(arg2);
    arg2.services.forEach(value => {
        value.services.forEach((data, index) => {
           service.forEach(serv => {
               if ( data.title === serv.title) {
                   if ( serv.isSelected ) {
                       let flag = 0;
                       val.forEach(val => {
                           if ( val.title === serv.title ) {
                               flag = 1;
                           }
                       });
                       if ( flag === 0 ) {
                           val.push(data);
                       }
                   }
               }
           });
            if ( data.required === 1) {
                if ( data.required === 1 ) {
                    let flag = 0;
                    val.forEach(val => {
                        if ( val.title === data.title ) {
                            flag = 1;
                        }
                    });
                    if ( flag === 0 ) {
                        val.push(data);
                    }
                }
            }
        });
    });
    arg2.services = val;
    return arg2;
}