import { Injectable } from '@angular/core';
import { create, all } from 'mathjs';

@Injectable({
    providedIn: 'root',
})
export class FormulaValidationService {
    private math = create(all);

    constructor() {
        this.math.import(
            {
                ternary: (condition: boolean, trueExpr: any, falseExpr: any) => {
                    return condition ? trueExpr : falseExpr;
                },
            },
            { override: true }
        );
    }

    validateFormula(formula: string): boolean {
        try {
            this.math.evaluate(formula);
            return true;
        } catch (error) {
            return false;
        }
    }

    evaluateFormula(formula: string): number {
        return this.math.evaluate(formula);
    }
}
