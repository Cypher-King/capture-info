'use strict';

class ClientUtils {
    developers = [
        "343777234982797318", // Dmytro Vishnevsky
        "262583849438019589",  // Cypher King
    ];

    disabled_guilds = [
        "742406971625570345", // Tucson Illegals
        "790296516760829962", // SaintRose Illegals
        "683063871891570757", // Red-Rock Illegals
        "603606998759768091", // Surprise Illegals
        "894294310793666621", // Prescott Illegals
        "653270290159370241", // Glendale Illegals
        "821074255739355187", // Winslow Illegals
        "754234813116055632", // Show-Low Illegals
        "926474490320408576", // Page Illegals
    ];

    get_mysql_servername(value) {
        if (value == '02') return "tucson";
        else if (value == '06') return "saintrose";
        else if (value == '08') return "redrock";
        else if (value == '10') return "surprise";
        else if (value == '11') return "prescott";
        else if (value == '12') return "glendale";
        else if (value == '14') return "winslow";
        else if (value == '15') return "payson";
        else if (value == '17') return "showlow";
        else if (value == '19') return "page";
        else if (value == 'el_01_state') return "el_titan_state";
        else if (value == 'el_01_ru') return "el_titan_ru";
        else if (value == 'el_01_ru') return "el_titan_ru";
        else if (value == '00') return "test";
    };
    
    get_dsmysql_servername(value) {
        if (value == '02') return "tucson";
        else if (value == '06') return "saintrose";
        else if (value == '08') return "redrock";
        else if (value == '10') return "surprise";
        else if (value == '11') return "prescott";
        else if (value == '12') return "glendale";
        else if (value == '14') return "winslow";
        else if (value == '15') return "payson";
        else if (value == '17') return "showlow";
        else if (value == '19') return "page";
        else if (value == 'el_01_state') return "el_titan_state";
        else if (value == 'el_01_ru') return "el_titan_ru";
        else if (value == '00') return "test";
    };

    get_servernumber(server) {
        if (server.includes('phoenix')) return '01';
        else if (server.includes('tucson')) return '02';
        else if (server.includes('scottdale')) return '03';
        else if (server.includes('chandler')) return '04';
        else if (server.includes('brainburg')) return '05';
        else if (server.includes('saintrose') || server.includes('saint-rose')) return '06';
        else if (server.includes('mesa')) return '07';
        else if (server.includes('redrock') || server.includes('red-rock')) return '08';
        else if (server.includes('yuma')) return '09';
        else if (server.includes('surprise')) return '10';
        else if (server.includes('prescott')) return '11';
        else if (server.includes('glendale')) return '12';
        else if (server.includes('kingman')) return '13';
        else if (server.includes('winslow')) return '14';
        else if (server.includes('payson')) return '15';
        else if (server.includes('gilbert')) return '16';
        else if (server.includes('show-low')) return '17';
        else if (server.includes('page')) return '19';
        else return '00';
    };
    
    isAN(value) {
        return !isNaN(value) && (value instanceof Number||typeof value === 'number');
    };
};

module.exports = new ClientUtils();