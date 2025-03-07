import {Cell, Column, Schema} from "../../types/types";
import log from "@ajar/marker";
import {getDB} from "../../db/db.connection";
import {getFunctionParameters, isLookUp, lookup, lookup2} from "./sheets.util";
import validationException from "../../exceptions/validation.exception";

export class Sheet {
    columns? : Column[];
    schema? : Schema

    constructor(props:any) {
        this.columns = props.columns;
        this.schema = props.schema;

    }

    setCell(column_name : string, cell_data: Cell) :any {
        const method = "Sheet/setCell"

        //number //value
        if (!this.columns){
            this.columns = [];
        }
        let column = this.columns.find(col => col.name === column_name);
        if (column) {
            let cell = column.cells.find(cell => cell.number === cell_data.number);
            if(cell) {
                cell.value = cell_data.value
                cell.view_value = cell_data.value
            } else {
                column.cells.push({
                    number : cell_data.number,
                    value : cell_data.value,
                    view_value: cell_data.value
                });
            }
        } else {
            this.columns.push({
                name: column_name,
                cells: [{
                    number : cell_data.number,
                    value : cell_data.value,
                    view_value: cell_data.value
                }]
            })
        }
        // @ts-ignore
        let cell = sheet.columns.find(col => col.name === column_name).cells.find(cell => cell.number == cell_data.number);
        let current_cell = column_name+cell_data.number;
        let cell_value = cell_data.value
        if(isLookUp(cell_value)) {
            while(isLookUp(cell_value)) {
                const loopup_cell_coor = getFunctionParameters(cell_value);
                const formattedColumnName = loopup_cell_coor[0].replace(/^'(.*)'$/, '$1');
                if(formattedColumnName+loopup_cell_coor[1] == current_cell) {
                    throw new validationException(
                        400,
                        `Circular Reference found.`
                    );
                } else {
                    cell_value = lookup2(this.columns,loopup_cell_coor);
                }
            }
            column = this.columns.find((col)=>col.name === column_name);
            if(column) {
                cell = column.cells.find((col)=>col.number === cell_data.number);
                if(cell) {
                    cell["view_value"] = cell_value;
                }
            }
            if(!cell || !(cell["view_value"])) {
                throw "Cell not found for set."
            }
        }
        log.blue(`${method} - end`);
        return {
            status: "success",
            data : this
        };
    }

    // setCell2(sheet_id : string, column_name : string, cell_data: Cell) {
    //     const method = "Service/setCell"
    //     log.blue(`${method} - start`);
    //     try{
    //         const database = getDB();
    //         const sheet =  database[sheet_id];
    //         if (!sheet.columns){
    //             sheet.columns = [];
    //         }
    //         let column = sheet.columns.find(col => col.name === column_name);
    //         if (column) {
    //             let cell = column.cells.find(cell => cell.number === cell_data.number);
    //             if(cell) {
    //                 cell.value = cell_data.value
    //                 cell.view_value = cell_data.value
    //             } else {
    //                 column.cells.push({
    //                     number : cell_data.number,
    //                     value : cell_data.value,
    //                     view_value: cell_data.value
    //                 });
    //             }
    //         } else {
    //             sheet.columns.push({
    //                 name: column_name,
    //                 cells: [{
    //                     number : cell_data.number,
    //                     value : cell_data.value,
    //                     view_value: cell_data.value
    //                 }]
    //             })
    //         }
    //         // @ts-ignore
    //         let cell = sheet.columns.find(col => col.name === column_name).cells.find(cell => cell.number == cell_data.number);
    //         let current_cell = column_name+cell_data.number;
    //         let cell_value = cell_data.value
    //         if(isLookUp(cell_value)) {
    //             while(isLookUp(cell_value)) {
    //                 const loopup_cell_coor = getFunctionParameters(cell_value);
    //                 const formattedColumnName = loopup_cell_coor[0].replace(/^'(.*)'$/, '$1');
    //                 if(formattedColumnName+loopup_cell_coor[1] == current_cell) {
    //                     throw "Circular Reference found.";
    //                 } else {
    //                     cell_value = lookup(sheet,loopup_cell_coor);
    //                 }
    //             }
    //             column = sheet.columns.find((col)=>col.name === column_name);
    //             if(column) {
    //                 cell = column.cells.find((col)=>col.number === cell_data.number);
    //                 if(cell) {
    //                     cell["view_value"] = cell_value;
    //                 }
    //             }
    //             if(!cell || !(cell["view_value"])) {
    //                 throw "Cell not found for set."
    //             }
    //         }
    //         log.blue(`${method} - end`);
    //         return {
    //             status: "success",
    //             data : sheet
    //         };
    //     } catch (err) {
    //         log.red(`${method} - error`);
    //         return {
    //             status: "error",
    //             data : err
    //         };
    //     }
    //
    // }

}