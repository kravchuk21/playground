function arrayView(...arrays) {
    return new Proxy({}, {
        get(target, prop, receiver) {
           if (prop === 'length') {
               return arrays.reduce((acc, arr) => acc + arr.length, 0);
           }

           const index = Number(prop);

           if (!isNaN(index) && index >= 0 && index % 1 === 0 && index < 2 ** 32) {
               let l = 0;

               for (const arr of arrays) {
                   const o = l;

                   l += arr.length;

                   if (index < l) {
                       return arr[index - o];
                   }
               }

               return undefined;
           }

           return Reflect.get(target, prop, receiver);
        }
    });
}

const arr = arrayView([1, 2, 3], [4, 5, 6]);

console.log(arr[0]);
console.log(arr[3]);
console.log(arr[13]);
console.log(arr.length);