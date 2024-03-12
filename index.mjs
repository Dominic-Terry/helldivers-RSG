import stratagemsJSON from './stratagems.json' assert { type: 'json' };
const stratObj = stratagemsJSON[0];

const fillStratContainer = (containerElem, stratagems) => {
    const flatten = (inObj) => {
        let outObj = {};
        Object.entries(inObj).forEach(([k, v]) => {
            if (typeof v != 'string') {
                outObj = { ...outObj, ...flatten(v) };
            } else {
                outObj[k] = v;
            }
        });

        return outObj;
    };

    const flatObj = flatten(stratagems);

    // flatten object
    // create bounds & toggleable buttons

    Object.entries(flatObj).forEach(([name, src]) => {
        const img = document.createElement('img');
        img.src = './assets/stratagems/' + src;
        img.classList = 'strat-img enabled';
        img.alt = name;
        img.title = name;
        img.setAttribute('draggable', false);
        img.addEventListener('click', (evt) => {
            evt.target.classList.toggle('enabled');
            evt.target.classList.toggle('disabled');
        });
        containerElem.append(img);
    });
};

fillStratContainer(
    document.querySelector('#offensive-container'),
    stratObj.offensive
);

fillStratContainer(
    document.querySelector('#defensive-container'),
    stratObj.defensive
);

fillStratContainer(
    document.querySelector('#support-container'),
    stratObj.support
);
