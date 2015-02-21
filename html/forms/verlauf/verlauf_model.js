// -- <?php
/*
 * Copyright (c) 2015 by Wolfgang Wiedermann
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA
 */
//?>

var hhb = hhb || {};
hhb.model = hhb.model || {};
hhb.model.types = hhb.model.types || {};

// Eintrag für die Verlaufsdarstellung mit einer Kurve
hhb.model.types.VerlaufEintragEinfach = function(data) {
    var self = this;

    self.monat = ko.observable("000000");
    self.betrag = ko.observable(0);

    if(!!data) {
        self.monat(data.grouping);
        self.betrag(data.saldo);
    }
};

// Eintrag für die Verlaufsdarstellung mit mehreren Kurven
hhb.model.types.VerlaufEintragMehrfach = function(data) {
    var self = this;

    self.monat = ko.observable("000000");
    self.betraege = ko.observableArray([0, 0]);

    if(!!data) {
        self.monat(data.monat);
        self.betraege.push(data.betrag_vormonat);
        self.betraege.push(data.betrag_aktuell);
    }
};

// Zentraler Model-Knoten für die Verlaufsauswertungen
hhb.model.types.VerlaufModel = function() {
    var self = this;

    self.titel = ko.observable("Verlaufsauswertung");

    self.verlauf_einfach = ko.observableArray([]);
    self.verlauf_einfach.push(new hhb.model.types.VerlaufEintragEinfach());

    self.verlauf_mehrfach = ko.observableArray([]);
    self.verlauf_mehrfach.push(new hhb.model.types.VerlaufEintragMehrfach());

    self.verlaufaufwand = function() {
        self.titel('Verlauf: Aufwand');
        self.verlauf_einfach.removeAll();
        self.loadVerlaufEinfach('ergebnis', 'verlauf', {'id': 3});
    };

    self.verlaufertrag = function() {
        self.titel('Verlauf: Ertrag');
        self.verlauf_einfach.removeAll();
        self.loadVerlaufEinfach('ergebnis', 'verlauf', {'id': 4});
    };

    self.verlaufgewinn = function() {
        self.titel('Verlauf: Gewinn');
        self.verlauf_einfach.removeAll();
        self.loadVerlaufEinfach('ergebnis', 'verlauf_gewinn', {});
    };

    self.loadVerlaufEinfach = function(controller, action, parameters) {
        doGETwithCache(controller, action, parameters,
            function(data) {
                var diagramData = [];

                for(var key in data) {
                    var line = data[key];
                    self.verlauf_einfach.push(new hhb.model.types.VerlaufEintragEinfach(line));
                    diagramData.push(line.saldo);

                    d.init("verlauf_einfach_grafik");
                    d.setToWindowWidth();
                    d.drawLineDiagramFor(diagramData);
                }
                jQuery.mobile.changePage('#verlauf_einfach_view');
            },
            function(error) {
                util.showErrorMessage(error);
            }
        );
    };
};