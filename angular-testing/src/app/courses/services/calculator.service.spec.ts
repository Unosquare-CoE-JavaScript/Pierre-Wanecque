import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

// xdescribe doesn't call this describe
// fdescribe only call this it (focus)
describe('CalculatorService', () => {

    let calculator: CalculatorService, loggerSpy: any;

    // execute before each it
    beforeEach(()=> {
        //console.log("Calling beforeEach");
        // Using Jasmine spy for fake implementation log method of LoggerService (not real instance)
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        // allow to provide dependency with DI instead of contructor
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,  // Real instance
                {provide: LoggerService, useValue: loggerSpy} // Fake implementation (Swap to jasmine spy)
            ]
        });

        // calling testBed, for testing only CalculatorService, all other implementation are Mocked :)
        calculator = TestBed.get(CalculatorService);
    });

    // xit doesn't call this it
    // fit only call this it (focus)
    it('should add two numbers', () => {
        //console.log("add test");
        const result = calculator.add(2, 2);
        expect(result).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });


    it('should subtract two numbers', () => {
        //console.log("subtract test");
        const result = calculator.subtract(2, 2);
        expect(result).toBe(0, "unexpected subtraction result");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

});
