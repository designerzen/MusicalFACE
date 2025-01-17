import { Pattern, currentBeat } from './pattern.js'

// Note functions - can be called with and without parameter (also without parantheses)
export function createNoteFunctions() {
    new Array(128).fill(null).map((v, ndx) => 
        (['c','cs','d','ds','e','f','fs','g','gs','a','as','b'])[ndx%12]+''+Math.floor(ndx/12)
    ).forEach((note, ndx) => self[note] = (duration, velocity, offset) => {
        const noteFunc = async (pattern, rowbeat) => {    
            await pattern.waitForBeat(rowbeat + (offset ? offset : 0));          
            
            pattern.velocity = velocity && typeof duration !== 'object'? velocity : pattern.defaultvelocity;
            if(!duration || typeof duration === 'object') {
                duration = 1 / pattern.stepsperbeat;
            }    
            pattern.note(ndx, duration);
        };

        if(typeof duration === 'object') {
            return noteFunc(duration, velocity);
        } else {
            return noteFunc;
        }
    });
}

export const pitchbend = (start, target, duration, steps) => async (pattern, rowbeat) => {
    await pattern.waitForBeat(rowbeat);
    pattern.pitchbend(start, target, duration, steps);
};

export const controlchange = (controller, start, target, duration, steps) => async (pattern, rowbeat) => {
    await pattern.waitForBeat(rowbeat);
    pattern.controlchange(controller, start, target ? target : start, duration, steps)
};

export class TrackerPattern extends Pattern {
    constructor(output, channel, stepsperbeat, defaultvelocity = 100) {
        super(output);            
        this.channel = channel;
        this.stepsperbeat = stepsperbeat;
        this.defaultvelocity = defaultvelocity;
    }
    
    async steps(stepsperbeat, events) {
        this.offset = Math.round(currentBeat());                              
        for(let step=0;step < events.length; step++) {
            let beat = step / stepsperbeat;
            const event = events[step];
            if(event && event.constructor && event.constructor.name === 'AsyncFunction') {
                event(this, beat);                
            } else if(event && event.constructor && event.constructor.name === 'Function') {
                (async () => {        
                    const waitforbeat = beat;                                    
                    await this.waitForBeat(beat); 
                                      
                    event(this, beat);
                })();
            } else if(event && event.length) {
                // Array
                for (let evt of event) {
                    if(evt.constructor.name === 'AsyncFunction') {
                        evt(this, beat);
                    } else {
                        const waitforbeat = beat;                                    
                        await this.waitForBeat(beat); 
                                        
                        evt(this, beat);
                    }
                }
            }
        }
        await this.waitForBeat(events.length / stepsperbeat);  
    }

    async play(rows, rowbeatcolumnmode) {           
        this.offset = Math.round(currentBeat());
        let rowbeat = 0;
                
        if(typeof rows[0]==='function') {                        
            rows = [[0].concat(rows)];
        }
        for(let ndx=0;ndx<rows.length;ndx++) {
            const cols = rows[ndx];
            
            if(!rowbeatcolumnmode) {
                rowbeat = cols[0];
            }
            
            for(let colndx = 1; colndx < cols.length; colndx++) {
                const col = cols[colndx];                       
                if(col.constructor.name === 'AsyncFunction') {
                    col(this, rowbeat);                
                } else {
                    (async () => {        
                        const waitforbeat = rowbeat;                                    
                        await this.waitForBeat(rowbeat);                        
                        col(this, waitforbeat);
                    })();
                }
            };   
            
            if(rowbeatcolumnmode===1) {
                rowbeat += cols[0];
            }
        }   
        await this.waitForBeat(rowbeat);      
    }
}
