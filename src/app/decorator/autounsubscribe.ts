// export class Autounsubscribe {
// }
// To use the decorator for auto unsubscribe of any observable
// add ngOnDetroy(){} in the component
// assign an object for each of the subscribed observables
// add decorator
// @Autounsubscribe()

export function Autounsubscribe() {
    return function(constructor) {
        const origOnDestroy = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function() {
            for (const prop in this) {
                const property = this[prop];
                // console.log("unsubscribe",property, typeof property?.unsubscribe);
                if (typeof property?.unsubscribe === 'function') {
                    // console.log("unsubscribe inside if",property, property.unsubscribe);
                    property.unsubscribe();
                }
            }
            origOnDestroy.apply();
        };
    };
}
