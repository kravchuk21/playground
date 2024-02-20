const el = document.querySelector('div');

// el.addEventListener('click', (e) => {
//     console.log(e);
// }, { once: true });

function on(el, event) {
    return new Promise((resolve) => {
        el.addEventListener(event, resolve, { once: true });
    });
}

on(el, 'click').then((e) => {
    console.log(e);
});



function logAfter(task) {
    task.then(() => console.log('...'));
}

logAfter(on(el, 'click'));