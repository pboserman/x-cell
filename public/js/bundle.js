(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();


},{"./table-model":5,"./table-view":6}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum) {
    return Array.from({ length: toNum - fromNum + 1}, 
        (unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A', numLetters) {
    const rangeStart = firstLetter.charCodeAt(0);
    const rangeEnd = rangeStart + numLetters - 1;
    return getRange(rangeStart, rangeEnd)
        .map(charCode => String.fromCharCode(charCode));
};

module.exports = {
    getRange: getRange,
    getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl) {
    while(parentEl.firstChild) {
        parentEl.removeChild(parentEl.firstChild);
    }
};

const createEl = function(tagName) {
    return function(text) {
        const el = document.createElement(tagName);
        if (text) {
            el.textContent = text;
        }
        return el;
    };
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
    createTH: createTH,
    createTD: createTD,
    createTR: createTR,
    removeChildren: removeChildren
};
},{}],4:[function(require,module,exports){
const getSumFromArray = function(...numArray) {
    return numArray.reduce((a, b) => a + b, 0);
};

module.exports = {
    getSumFromArray: getSumFromArray
};
},{}],5:[function(require,module,exports){
class TableModel {
    constructor(numCols=10, numRows=20) {
        this.numCols = numCols;
        this.numRows = numRows;
        this.data = {};
    }

    _getCellId(location) {
        return `${location.col}:${location.row}`;
    }

    getValue(location) {
        return this.data[this._getCellId(location)];
    }

    setValue(location, value) {
        this.data[this._getCellId(location)] = value;
    }
}

module.exports = TableModel;
},{}],6:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');
const { getSumFromArray } = require('./sum-util');

class TableView {
    constructor(model) {
        this.model = model;
    }

    init() {
        this.initDomReferences();
        this.initCurrentCell();
        this.renderTable();
        this.attachEventHandlers();
    }

    initDomReferences() {
        this.headerRowEl = document.querySelector('THEAD TR');
        this.sheetBodyEl = document.querySelector('TBODY');
        this.sheetFootEl = document.querySelector('TFOOT TR');
        this.formulaBarEl = document.querySelector('#formula-bar');
    }

    initCurrentCell() {
        this.currentCellLocation = { col: 0, row: 0 };
        this.renderFormulaBar();
    }

    normalizeValueForRendering(value) {
        return value || '';
    }

    renderFormulaBar() {
        const currentCellValue = this.model.getValue(this.currentCellLocation);
        this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
        this.formulaBarEl.focus();
    }

    isCurrentCell(col, row) {
        return this.currentCellLocation.col === col &&
               this.currentCellLocation.row === row;
    }

    renderTable() {
        this.renderTableHeader();
        this.renderTableBody();
        this.renderTableFoot();
    }

    renderTableHeader() {
        removeChildren(this.headerRowEl);
        getLetterRange('A', this.model.numCols)
            .map(colLabel => createTH(colLabel))
            .forEach(th => this.headerRowEl.appendChild(th));
    }

    renderTableBody() {
        const fragment = document.createDocumentFragment();
        for (let row = 0; row < this.model.numRows; row++) {
            const tr = createTR();
            for (let col = 0; col < this.model.numCols; col++) {
                const position = {col: col, row: row};
                const value = this.model.getValue(position);
                const td = createTD(value);

                if (this.isCurrentCell(col, row)) {
                    td.className = 'current-cell';
                }

                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        removeChildren(this.sheetBodyEl);
        this.sheetBodyEl.appendChild(fragment);
    }

    renderTableFoot() {
        const fragment = document.createDocumentFragment();
        for (let col = 0; col < this.model.numCols; col++) {
            const position = {col: col, row: 0};
            const value = this.handleColSum(col);
            const td = createTD(value);
            fragment.appendChild(td);
        }
        removeChildren(this.sheetFootEl);
        this.sheetFootEl.appendChild(fragment);
    }

    attachEventHandlers() {
        this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
        this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
    }

    handleFormulaBarChange(evt) {
        const value = this.formulaBarEl.value;
        this.model.setValue(this.currentCellLocation, value);
        this.renderTableBody();
        this.renderTableFoot();
    }

    handleColSum(col) {
        const valueArray = [];
        for (let row = 0; row < this.model.numRows; row++) {
            const position = { col: col, row: row };
            const value = Number(this.model.getValue(position), 10);
            if (value) {
                valueArray.push(value);
            }
        }
        return getSumFromArray(...valueArray);
    }

    handleSheetClick(evt) {
        const col = evt.target.cellIndex;
        const row = evt.target.parentElement.rowIndex - 1;

        this.currentCellLocation = { col: col, row: row };

        this.renderTableBody();
        this.renderFormulaBar();
    }


}

module.exports = TableView;
},{"./array-util":2,"./dom-util":3,"./sum-util":4}]},{},[1]);
