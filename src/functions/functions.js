import _ from 'lodash';

const vinCharacterMapping = {

    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,

    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,

    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9

}

const multiplyByPlacementMapping = {

    1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 10, 9: 0,

    10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2,

}

export const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export const verifyVIN = (vin) => {

    let oldVinVlaue = vin;
   
    var validateVinRegx = /^(?!.*i|.*q|.*o|.*I|.*Q|.*O).*$/;

    if(vin.length !== 17) {
        return;
    }
    vin = vin.toUpperCase();

    if(!validateVinRegx.test(vin)) { 
        return;
    }
    vin = vin.split('');

    // Multiply each numeric equivalent (or numeric digit) based on its placement in the VIN.

    vin = _.map(vin, (character, index) => {
        if(isNaN(character)){
            return vinCharacterMapping[character];
        }else{
            if(character ===  0) return 0;
            let mapped = multiplyByPlacementMapping[character];
            return  mapped * character;
        }
    });

    vin = _.sum(vin);
    
    vin = vin % 11;
    
    let matchWith = oldVinVlaue.substr(0, 9);

    
    if(matchWith.includes(vin) && matchWith.charAt(matchWith.length - 1) === 'X' ) { 

      
        return oldVinVlaue.toUpperCase();
        // return true;
    }
    //Using the mapping rule identify the value of the check digit and compare is to the value in position 9 of the VIN. 
    return oldVinVlaue;
}

export const formatMacAddress = (e) => {

    var r = /([a-f0-9]{2})([a-f0-9]{2})/i,
        str = e.target.value.replace(/[^a-f0-9]/ig, "");

    while (r.test(str)) {
        str = str.replace(r, '$1:$2');
    }

    return e.target.value = str.slice(0, 17);
};


