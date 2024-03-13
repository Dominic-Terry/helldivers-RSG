import stratagemsJSON from './stratagems.json' assert { type: 'json' };
const stratObj = stratagemsJSON[0];

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

const fillStratContainer = (containerElem, stratagems) => {
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
            // evt.target.classList.toggle('highlighted');
        });
        img.dataset.type =
            name
                .match(
                    /(Eagle)|(Orbital)|(Sentry)|(Mine)|(Relay)|(Emplacement)|(Tower)/im
                )?.[0]
                ?.replace(/(Relay)|(Tower)|(Mine)/im, 'Emplacement') ||
            'Support';

        img.dataset.hasBackpack = name.match(
            /(^AC-8)|(FAF-14)|(GR-8)|(Guard Dog)|(pack)/im
        )?.[0]
            ? true
            : false;

        if (img.dataset.type == 'Support') {
            let match = name.match(/(Guard Dog)|(pack)|(EXO)/im);

            img.dataset.type = match?.[0] ? 'Support' : 'Support-Weapon';
        }

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

const reset = () => {
    document.querySelectorAll('.strat-img').forEach((elem) => {
        elem.classList.add('enabled');
        elem.classList.remove('disabled');
        elem.classList.remove('highlighted');
    });

    document.querySelector('#pick-random-input').value = '';
};

document
    .querySelector('#stratagem-reset-button')
    .addEventListener('click', () => {
        reset();
    });

document.querySelector('#generate-stratagems').addEventListener('click', () => {
    let rolls = document.querySelector('#pick-random-input').value;
    let backpackCheck = document.querySelector('#backpack-input').checked;
    let supportWeaponCheck = document.querySelector(
        '#support-weapon-input'
    ).checked;

    reset();
    if (!rolls) rolls = 4;
    if (rolls < 1) rolls = 1;
    if (rolls > 4) rolls = 4;
    let backpackFilled = false;
    let supportWeaponFilled = false;

    const selectStrat = () => {
        const type = ['offensive', 'defensive', 'support'][
            Math.round(Math.random() * 2)
        ];
        let selected, available, val;
        switch (type) {
            case 'offensive':
                val = Math.round(Math.random());
                if (val == 0) {
                    // eagle
                    available = document.querySelectorAll(
                        '.enabled[data-type=Eagle]:not(.highlighted)'
                    );
                } else if (val == 1) {
                    // orbital
                    available = document.querySelectorAll(
                        '.enabled[data-type=Orbital]:not(.highlighted)'
                    );
                }
                break;

            case 'defensive':
                val = Math.round(Math.random());
                if (val == 0) {
                    // Sentry
                    available = document.querySelectorAll(
                        '.enabled[data-type=Sentry]:not(.highlighted)'
                    );
                } else if (val == 1) {
                    // Emplacement
                    available = document.querySelectorAll(
                        '.enabled[data-type=Emplacement]:not(.highlighted)'
                    );
                }
                break;

            case 'support':
                val = Math.round(Math.random() * 3);

                if (val == 0 && !backpackFilled && !supportWeaponFilled) {
                    // support weapon (with pack)
                    available = document.querySelectorAll(
                        '.enabled[data-type=Support-Weapon][data-has-backpack=true]:not(.highlighted)'
                    );
                    if (backpackCheck) backpackFilled = true;
                    if (supportWeaponCheck) supportWeaponFilled = true;
                } else if (val == 1 && !supportWeaponFilled) {
                    // support weapon (no pack)
                    available = document.querySelectorAll(
                        '.enabled[data-type=Support-Weapon][data-has-backpack=false]:not(.highlighted)'
                    );
                    if (supportWeaponCheck) supportWeaponFilled = true;
                } else if (val == 2 && !backpackFilled) {
                    // support backpack
                    available = document.querySelectorAll(
                        '.enabled[data-type=Support][data-has-backpack=true]:not(.highlighted)'
                    );
                    if (backpackCheck) backpackFilled = true;
                } else if (val == 3) {
                    // other support
                    available = document.querySelectorAll(
                        '.enabled[data-type=Support][data-has-backpack=false]:not(.highlighted)'
                    );
                }
                break;
        }

        if (available?.length > 0) {
            selected = available[Math.round(Math.random() * available.length)];
        }
        return selected;
    };

    for (let i = 0; i < rolls; i++) {
        let selected;
        while (!selected) {
            selected = selectStrat();
        }

        selected.classList.add('highlighted');
    }
});
