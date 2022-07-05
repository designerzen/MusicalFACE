!function(e,t,r,o,n){var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof s.parcelRequireaaed&&s.parcelRequireaaed,i=a.cache||{},c="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(t,r){if(!i[t]){if(!e[t]){var o="function"==typeof s.parcelRequireaaed&&s.parcelRequireaaed;if(!r&&o)return o(t,!0);if(a)return a(t,!0);if(c&&"string"==typeof t)return c(t);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}u.resolve=function(r){var o=e[t][1][r];return null!=o?o:r},u.cache={};var d=i[t]=new l.Module(t);e[t][0].call(d.exports,u,d,d.exports,this)}return i[t].exports;function u(e){var t=u.resolve(e);return!1===t?{}:l(t)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=e,l.cache=i,l.parent=a,l.register=function(t,r){e[t]=[function(e,t){t.exports=r},{}]},Object.defineProperty(l,"root",{get:function(){return s.parcelRequireaaed}}),s.parcelRequireaaed=l;for(var d=0;d<t.length;d++)l(t[d]);var u=l(r);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof define&&define.amd&&define((function(){return u}))}({"4sCyq":[function(e,t,r){var o=e("./midi-file-load");self.onmessage=e=>{console.error("MIDI:Worker",e);const t=e.data;switch(t.command){case"loadMIDIFile":(0,o.loadMIDIFile)(t.url,t.options).then((e=>{console.error("MIDI:Worker loaded",{url:t.url,midi:e}),postMessage({event:t.command,midi:e})}));break;case"loadMIDIFileThroughClient":(0,o.loadMIDIFileThroughClient)(t.url,t.options).then((e=>{console.error("MIDI:Worker loaded",{url:t.url,midi:e}),postMessage({event:t.command,midi:e})}))}}},{"./midi-file-load":"f9vVY"}],f9vVY:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"loadMIDIFromFile",(()=>u)),o.export(r,"loadMIDIFile",(()=>p)),o.export(r,"loadMIDIFileThroughClient",(()=>m));var n=e("./midi-stream"),s=o.interopDefault(n),a=e("./midi-decode"),i=e("../../utils");const c=e=>Array.prototype.map.call(e,(e=>String.fromCharCode(e))).join(""),l=async(e,t={},r=null)=>new Promise(((r,o)=>{try{const o=c(new Uint8Array(e)),n=new(0,s.default)(o);r((0,a.decodeMIDI)(n,t))}catch(e){o(e)}})),d=async(e,t={},r=null)=>new Promise(((r,o)=>{try{const o=e.split(",")[1],l=(n=o,"object"==typeof window&&"object"==typeof document&&window.document===document?window.atob:c((0,i.base64DecToArr)(n))),d=new(0,s.default)(l);r((0,a.decodeMIDI)(d,t))}catch(e){o(e)}var n})),u=(e,t={},r=null)=>new Promise(((o,n)=>{const s=new XMLHttpRequest;s.open("GET",e,!0),s.responseType="arraybuffer",s.onerror=e=>n(e),s.onreadystatechange=e=>{if(4===s.readyState&&200===s.status){const e=s.response;if(e){const n=new Uint8Array(e),s=l(n,t,r);o(s)}}},s.send(null)})),p=(e,t={},r=null)=>new Promise((async(o,n)=>{let s;if("string"==typeof e){s=-1===e.indexOf("base64,")?await u(e,t,r):await d(e,t,r),console.error("loadMIDIFile via BASE64",{urlOrBlob:e,midiFile:s})}else s=await l(e,t,r),console.error("loadMIDIFile via ArrayBuffer",{urlOrBlob:e,midiFile:s});o(s)})),m=async(e,t,r,o=!1)=>{const n=await((e,t,r=!0)=>new Promise(((o,n)=>{const s=new FileReader;s.onload=e=>o(s.result),s.onprogress=e=>t&&t(e),s.onerror=e=>n(s.error),r?s.readAsDataURL(e):s.readAsArrayBuffer(e)})))(e,r,o);return await p(n,{...t,trackName:e.name.split(".mid")[0].replace("_"," ")},r)}},{"./midi-stream":"lAHzI","./midi-decode":"HWbDn","../../utils":"jKVGE","@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],lAHzI:[function(e,t,r){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);r.default=class{position=0;str;constructor(e){this.str=e}read(e){const t=this.str.substr(this.position,e);return this.position+=e,t}readInt32(){const e=(this.str.charCodeAt(this.position)<<24)+(this.str.charCodeAt(this.position+1)<<16)+(this.str.charCodeAt(this.position+2)<<8)+this.str.charCodeAt(this.position+3);return this.position+=4,e}readInt16(){const e=(this.str.charCodeAt(this.position)<<8)+this.str.charCodeAt(this.position+1);return this.position+=2,e}readInt8(e=!1){const t=this.str.charCodeAt(this.position);return e&&t>127&&(t-=256),this.position+=1,t}readVarInt(){let e=0;for(;;){const t=this.readInt8(!1);if(!(128&t))return e+t;e+=127&t,e<<=7}}eof(){return this.position>=this.str.length}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],f4L6P:[function(e,t,r){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach((function(r){"default"===r||"__esModule"===r||t.hasOwnProperty(r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})})),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}],HWbDn:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"decodeMIDI",(()=>b));var n=e("./midi-stream"),s=o.interopDefault(n),a=e("./midi-command"),i=o.interopDefault(a),c=e("./midi-track"),l=o.interopDefault(c),d=e("./midi-commands"),u=e("../notes");const p="time-code-based";let m;const h=(e,t=4)=>{const r={};return r.id=e.read(t),r.length=e.readInt32(),r.data=e.read(r.length),r},f=e=>{const t=new(0,i.default),r=e.readVarInt(),o=e.readInt8();t.deltaTime=r;return 240==(240&o)?y(e,t,o):N(e,t,o)},N=(e,t,r)=>{let o;0==(128&r)?(o=r,r=m):(o=e.readInt8(),m=r);const n=r>>4;switch(t.channel=15&r,t.type=d.TYPE_CHANNEL,n){case 8:return t.subtype=d.COMMAND_NOTE_OFF,t.noteNumber=o,t.noteName=(0,u.convertMIDINoteNumberToName)(o),t.velocity=e.readInt8(),t;case 9:return t.noteNumber=o,t.noteName=(0,u.convertMIDINoteNumberToName)(o),t.velocity=e.readInt8(),0===t.velocity?t.subtype=d.COMMAND_NOTE_OFF:t.subtype=d.COMMAND_NOTE_ON,t;case 10:return t.subtype=d.COMMAND_NOTE_AFTER_TOUCH,t.noteNumber=o,t.noteName=(0,u.convertMIDINoteNumberToName)(o),t.amount=e.readInt8(),t;case 11:return t.subtype=d.COMMAND_CONTROLLER,t.controllerType=o,t.value=e.readInt8(),t;case 12:return t.subtype=d.COMMAND_PROGRAM_CHANGE,t.programNumber=o,t;case 13:return t.subtype=d.COMMAND_CHANNEL_AFTER_TOUCH,t.amount=o,t;case 14:return t.subtype=d.COMMAND_PITCH_BEND,t.value=o+(e.readInt8()<<7),t;default:throw"Unrecognised MIDI event type: "+n}},y=(e,t,r)=>{if(255!==r){if(240===r){t.type=d.TYPE_SYSTEM_EXCLUSIVE;const r=e.readVarInt();return t.data=e.read(r),t}if(247===r){t.type=d.TYPE_DIVIDED_SYSTEM_EXCLUSIVE;const r=e.readVarInt();return t.data=e.read(r),t}throw"Unrecognised MIDI event type byte: "+r}{t.type=d.TYPE_META;const r=e.readInt8(),o=e.readVarInt();switch(r){case 0:if(t.subtype="sequenceNumber",2!==o)throw"Expected length for sequenceNumber event is 2, got "+o;return t.sequenceNumber=e.readInt16(),t;case 1:return t.subtype="text",t.text=e.read(o),t;case 2:return t.subtype="copyrightNotice",t.text=e.read(o),t;case 3:return t.subtype="trackName",t.text=e.read(o),t;case 4:return t.subtype="instrumentName",t.text=e.read(o),t;case 5:return t.subtype="lyrics",t.text=e.read(o),t;case 6:return t.subtype="marker",t.text=e.read(o),t;case 7:return t.subtype="cuePoint",t.text=e.read(o),t;case 32:if(t.subtype="midiChannelPrefix",1!==o)throw"Expected length for midiChannelPrefix event is 1, got "+o;return t.channel=e.readInt8(),t;case 47:if(t.subtype="endOfTrack",0!==o)throw"Expected length for endOfTrack event is 0, got "+o;return t;case 81:if(t.subtype="setTempo",3!==o)throw"Expected length for setTempo event is 3, got "+o;return t.microsecondsPerBeat=(e.readInt8()<<16)+(e.readInt8()<<8)+e.readInt8(),t;case 84:if(t.subtype="smpteOffset",5!==o)throw"Expected length for smpteOffset event is 5, got "+o;const r=e.readInt8();return t.frameRate={0:24,32:25,64:29,96:30}[96&r],t.hour=31&r,t.min=e.readInt8(),t.sec=e.readInt8(),t.frame=e.readInt8(),t.subframe=e.readInt8(),t;case 88:if(t.subtype="timeSignature",4!==o)throw"Expected length for timeSignature event is 4, got "+o;return t.numerator=e.readInt8(),t.denominator=Math.pow(2,e.readInt8()),t.metronome=e.readInt8(),t.thirtyseconds=e.readInt8(),t;case 89:if(t.subtype="keySignature",2!==o)throw"Expected length for keySignature event is 2, got "+o;return t.key=e.readInt8(!0),t.scale=e.readInt8(),t;case 127:return t.subtype="sequencerSpecific",t.data=e.read(o),t;default:return t.subtype="unknown",t.data=e.read(o),t}}},b=(e,t={})=>{const r=((e,t={})=>{const r=h(e),o=r.id;if("MThd"!==o&&"MTrk"!==o||6!==r.length)throw".mid file could not be read - header chunk 'MThd'/'MTrk' was not found";const n=new(0,s.default)(r.data),a=n.readInt16(),i=n.readInt16(),c=n.readInt16(),l=32768&c,d=l?p:"metrical";switch(o){case"MThd":const e={};return d===p?(e.ticksPerFrame=255&c,e.framesPerSecond=(e=>1+(255^(65280&e)>>8))(c)):e.ticksPerQuarterNote=32767&c,{formatType:a,trackCount:i,timeDivision:c,isTimeCodeBased:l,timeCodeType:d,division:e};case"MTrk":return{formatType:a,trackCount:i,timeDivision:c,isTimeCodeBased:l,timeCodeType:d}}})(e);return((e,t)=>{const r=e.header.trackCount;for(let o=0;o<r;o++){const r=h(t);switch(r.id){case"MTrk":break;case"MThd":throw`Still working on MThd implementation... ${r.id}`;default:throw`Unexpected chunk - expected MTrk, got ${r.id}`}const n=new(0,s.default)(r.data);for(;!n.eof();){const t=f(n);e.addEvent(o,t)}}return e})(new(0,l.default)(r,t),e)}},{"./midi-stream":"lAHzI","./midi-command":"94cVd","./midi-track":"68H7N","./midi-commands":"lCwXv","../notes":"eLuxy","@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],"94cVd":[function(e,t,r){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);r.default=class{raw;time=0;timeCode=0;deltaTime;frameRate;channel;type;subtype;text;data;hour;min;sec;frame;subframe;microsecondsPerBeat;key;scale;numerator;denominator;metronome;thirtyseconds;amount;noteNumber;noteName;velocity;value;controllerType;programNumber;sequenceNumber;constructor(){}toString(){let e=`${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`;return this.channel&&(e+=` [Channel ${this.channel}] `),this.noteNumber&&(e+=` Note:${this.noteNumber} -> ${this.noteName}`),this.velocity&&(e+=` Velocity:${this.velocity}`),e+"\n"}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],"68H7N":[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r);var n=e("./general-midi"),s=e("./midi-command"),a=o.interopDefault(s),i=e("./midi-commands");r.default=class{header;tracks=[];commands=[];instruments=[];noteOnCommands=[];trackName="";meta="";copyrightNotice="Copyright held by respective owners";lyrics="";trackPosition=0;commandPosition=0;duration=0;mimeType="audio/mid";get ticksPerBeat(){}get tempo(){}get timeSignature(){return[4,4]}getMatchingCommands(e=[i.COMMAND_NOTE_ON],t="channel"){return typeof e===String&&(e=[e]),this.commands.filter((r=>{if(r.type===t){return e.indexOf(r.subtype)>-1}return!1}))}getNextNoteCommand(){const e=[];let t=this.tracks[++this.trackPosition];for(;t&&t.subtype!==i.COMMAND_NOTE_ON||t.subtype!==i.COMMAND_NOTE_OFF;)t=this.tracks[++this.trackPosition];for(;t&&(t.subtype===i.COMMAND_NOTE_ON||t.subtype===i.COMMAND_NOTE_OFF);)e.push(t),t=this.tracks[++this.trackPosition];return e}getNextNoteOnCommand(){const e=[];let t=this.tracks[++this.trackPosition];for(;t&&t.subtype===i.COMMAND_NOTE_ON;)e.push(t),t=this.tracks[++this.trackPosition];return e}getNextCommands(){return this.tracks[++this.trackPosition]}getNextNoteOnCommand(){return this.noteOnCommands[++this.commandPosition]}getDurationUntilNextCommand(){const e=this.tracks[this.trackPosition+1];return e?e.deltaTime:-1}convertTimeToFraction(e){return e.time/this.duration}copyCommand(e){const t=new(0,a.default);for(let r in e)t[r]=e[r];return t}constructor(e=null,t={}){e&&(this.header=e);for(let e in t)switch(e){case"commands":case"noteOnCommands":this[e]=t[e].map((e=>this.copyCommand(e)));break;default:this[e]=t[e],console.log(e,this[e])}}addEvent(e,t){const r=this.commands[this.commands.length-1];if(t.type===i.TYPE_META)switch(t.subtype){case"trackName":t.text&&"Untitled"!==t.text&&(this[t.subtype]=t.text);break;case"text":case"copyrightNotice":case"lyrics":t.text&&(this[t.subtype]+=t.text);break;default:t.text&&(this.meta+=t.text)}else{if(t.subtype===i.COMMAND_PROGRAM_CHANGE){const e=n.GENERAL_MIDI_INSTRUMENTS[t.programNumber];this.instruments.push(e)}if(t.subtype,i.COMMAND_NOTE_ON,i.COMMAND_NOTE_OFF,i.COMMAND_CONTROLLER,i.COMMAND_PITCH_BEND,i.COMMAND_PROGRAM_CHANGE,i.COMMAND_CHANNEL_AFTER_TOUCH,r)if(0===t.deltaTime){const e=r.timeCode;t.timeCode=e,t.time=this.duration;this.tracks[this.tracks.length-1].push(t)}else this.duration+=t.deltaTime||0,t.timeCode=t.deltaTime,t.time=this.duration,this.tracks.push([t]);else this.tracks.push([t]);if(this.commands.push(t),t.subtype===i.COMMAND_NOTE_ON)this.noteOnCommands.push(t)}}toString(){return`MIDI:Track::${this.commands.map((e=>e.toString())).join(", ")}`}commandToJSON(e){let t=`${e.time}. MIDI:Input::${e.subtype} Type:${e.type}`;return e.channel&&(t+=` [Channel ${e.channel}] `),e.noteNumber&&(t+=` Note:${e.noteNumber} -> ${e.noteName}`),e.velocity&&(t+=` Velocity:${e.velocity}`),t}toJSON(){return this.commands.map((e=>commandToJSON(e)))}}},{"./general-midi":"9Iyi7","./midi-command":"94cVd","./midi-commands":"lCwXv","@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],"9Iyi7":[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"GENERAL_MIDI_INSTRUMENTS",(()=>n)),o.export(r,"GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES",(()=>s)),o.export(r,"GENERAL_MIDI_INSTRUMENT_FAMILY_IDS",(()=>a)),o.export(r,"GENERAL_MIDI_FAMILIES",(()=>i)),o.export(r,"GENERAL_MIDI_INSTRUMENT_FAMILIES",(()=>c)),o.export(r,"FAMILY_DICTIONARY",(()=>l)),o.export(r,"DrumKitByPatchID",(()=>u));const n=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"],s=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","ethnic","percussive","sound effects"],a={0:"piano",7:"chromatic percussion",12:"organ",25:"guitar",33:"bass",41:"strings",49:"ensemble",57:"brass",65:"reed",69:"pipe",81:"synth lead",89:"synth pad",97:"synth effects",105:"ethnic",113:"percussive",123:"sound effects"},i=new Map,c={},l={};let d=a[0];n.forEach(((e,t)=>{a[t]&&(d=a[t]),i.set(d,[...i.get(d)||[],e]),l[e]=d}));const u={0:"standard kit",8:"room kit",16:"power kit",24:"electronic kit",25:"tr-808 kit",32:"jazz kit",40:"brush kit",48:"orchestra kit",56:"sound fx kit"}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],lCwXv:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"TYPE_CHANNEL",(()=>n)),o.export(r,"TYPE_META",(()=>s)),o.export(r,"TYPE_SYSTEM_EXCLUSIVE",(()=>a)),o.export(r,"TYPE_DIVIDED_SYSTEM_EXCLUSIVE",(()=>i)),o.export(r,"COMMAND_NOTE_OFF",(()=>c)),o.export(r,"COMMAND_NOTE_ON",(()=>l)),o.export(r,"COMMAND_NOTE_AFTER_TOUCH",(()=>d)),o.export(r,"COMMAND_CONTROLLER",(()=>u)),o.export(r,"COMMAND_PROGRAM_CHANGE",(()=>p)),o.export(r,"COMMAND_CHANNEL_AFTER_TOUCH",(()=>m)),o.export(r,"COMMAND_CHANNEL_PRESSURE",(()=>h)),o.export(r,"COMMAND_PITCH_BEND",(()=>f)),o.export(r,"COMMAND_SYSTEM_MESSAGE",(()=>N)),o.export(r,"COMMANDS",(()=>y));const n="channel",s="meta",a="sysEx",i="dividedSysEx",c="noteOff",l="noteOn",d="noteAftertouch",u="controller",p="programChange",m="channelAftertouch",h="channelPressure",f="pitchBend",N="systemMessage",y=[c,l,d,u,p,h,f,N]},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],eLuxy:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"SOLFEGE_SCALE",(()=>u)),o.export(r,"createInstrumentBanks",(()=>M)),o.export(r,"NOTE_NAMES",(()=>I)),o.export(r,"getNoteName",(()=>x)),o.export(r,"getNoteSound",(()=>E)),o.export(r,"getFriendlyNoteName",(()=>A)),o.export(r,"convertNoteNameToMIDINoteNumber",(()=>C)),o.export(r,"convertMIDINoteNumberToName",(()=>O)),o.export(r,"noteNumberToFrequency",(()=>_)),o.export(r,"frequencyToNoteNumber",(()=>v));var n=e("../maths/maths");const s=["A","Ab","B","Bb","C","D","Db","E","Eb","F","G","Gb"],a=["Ab","Bb","Db","Eb","Gb"],i=["A","B","C","D","E","F","G"],c=a.length-1,l=i.length-1,d=s.length,u=["Doe","Ray","Me","Far","Sew","La","Tea"],p={},m={},h=[],f=[],N=[],y=[],b=(e=0,t=0)=>{const r=e+t;return s[r<0?d+r:r%d]},M=(e="mp3",t=".")=>{const r=[];for(let o=0;o<s.length;++o){const n=s[o];"A"===n?r.push(`A0${t}${e}`):"B"===n&&r.push(`B0${t}${e}`);for(let o=1;o<8;++o)r.push(`${n}${o}${t}${e}`);"C"===n&&r.push(`C8${t}${e}`)}return r},g=e=>{const{key:t,octave:r}=(e=>({key:e.charAt(0),octave:parseInt(e.charAt(e.length-1))}))(e);return e=(e=e.replace(r,`-${r}`)).replace("b","#")},I=M("",""),T=I.map((e=>g(e)));for(let e=0;e<127;e++){const t=(e/d|0)-1,r=b(e%d,4),o=`${r}${t}`;m[o]=T[e],p[o]=e,f[e]=o,N[e]=o,h[e]={octave:t,key:r};const n=I.indexOf(o)>-1;y[e]=n?o:"UNKNOWN"}const x=(e,t=3,r=!1)=>{let o,s;return r?(o=Math.floor(e*c),s=a[o]):(o=Math.floor(e*l),s=i[o]),`${s}${(0,n.clamp)(t,1,7)}`},E=(e,t=!1)=>u[Math.floor(e*(u.length-1))],A=e=>m[e]||e,C=e=>p[e],O=e=>y[e],_=e=>440*Math.pow(2,(e-69)/12),D=Math.log(2),v=e=>{const t=Math.log(e/440)/D;return Math.round(12*t+69)}},{"../maths/maths":"bExI4","@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],bExI4:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"TAU",(()=>n)),o.export(r,"HALF_PI",(()=>s)),o.export(r,"rescale",(()=>d)),o.export(r,"determineAngle",(()=>u)),o.export(r,"distanceBetween2Points",(()=>p)),o.export(r,"distanceBetween3Points",(()=>m)),o.export(r,"distance3D",(()=>h)),o.export(r,"distance2D",(()=>f)),o.export(r,"lerp",(()=>N)),o.export(r,"clamp",(()=>y)),o.export(r,"twist",(()=>b));const n=2*Math.PI,s=.5*Math.PI,{PI:a,sqrt:i,atan2:c,tan:l}=Math,d=(e,t=1)=>{const r=1/(t-e);return t=>r*(t-e)},u=(e,t)=>{const r=e[1]-t[1],o=t[0]-e[0];return c(r,o)},p=(e,t)=>i((e[0]-t[0])**2+(e[1]-t[1])**2),m=(e,t)=>i((e[0]-t[0])**2+(e[1]-t[1])**2+(e[2]-t[2])**2),h=(e,t,r,o,n,s)=>i((e-t)**2+(r-o)**2+(n-s)**2),f=(e,t,r,o)=>i((e-t)**2+(r-o)**2),N=(e,t,r)=>(1-r)*e+r*t,y=(e,t,r)=>e>r?r:e<t?t:e,b=(e,t=0)=>y((e=e<0?-1*(e+1):1-e)+t,-1,1)},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}],jKVGE:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"convertOptionToObject",(()=>n)),o.export(r,"debounce",(()=>s)),o.export(r,"b64ToUint6",(()=>a)),o.export(r,"uint6ToB64",(()=>i)),o.export(r,"decodeBase64",(()=>c)),o.export(r,"base64DecToArr",(()=>l)),o.export(r,"base64EncArr",(()=>d)),o.export(r,"UTF8ArrToStr",(()=>u)),o.export(r,"strToUTF8Arr",(()=>p)),o.export(r,"toBytes",(()=>m)),o.export(r,"toVarLenBytes",(()=>h));const n=e=>e.reduce(((e,t)=>{const r=t.split(":");return e[r[0]]=parseFloat(r[1]),e}),{}),s=(e,t)=>{let r;return(...o)=>(clearTimeout(r),r=setTimeout((()=>e(...o)),t),r)},a=e=>e>64&&e<91?e-65:e>96&&e<123?e-71:e>47&&e<58?e+4:43===e?62:47===e?63:0,i=e=>e<26?e+65:e<52?e+71:e<62?e-4:62===e?43:63===e?47:65,c=(e,t)=>{const r=e.replace(/[^A-Za-z0-9\+\/]/g,""),o=r.length,n=t?Math.ceil((3*o+1>>2)/t)*t:3*o+1>>2,s=new Uint8Array(n);for(let e,t,i=0,c=0,l=0;l<o;l++)if(t=3&l,i|=a(r.charCodeAt(l))<<18-6*t,3===t||o-l==1){for(e=0;e<3&&c<n;e++,c++)s[c]=i>>>(16>>>e&24)&255;i=0}return s},l=(e,t)=>{for(var r,o,n=e.replace(/[^A-Za-z0-9\+\/]/g,""),s=n.length,i=t?Math.ceil((3*s+1>>2)/t)*t:3*s+1>>2,c=new Uint8Array(i),l=0,d=0,u=0;u<s;u++)if(o=3&u,l|=a(n.charCodeAt(u))<<6*(3-o),3===o||s-u==1){for(r=0;r<3&&d<i;r++,d++)c[d]=l>>>(16>>>r&24)&255;l=0}return c},d=e=>{let t=2,r="";for(var o=e.length,n=0,s=0;s<o;s++)t=s%3,s>0&&4*s/3%76==0&&(r+="\r\n"),n|=e[s]<<(16>>>t&24),2!==t&&e.length-s!=1||(r+=String.fromCodePoint(i(n>>>18&63),i(n>>>12&63),i(n>>>6&63),i(63&n)),n=0);return r.substr(0,r.length-2+t)+(2===t?"":1===t?"=":"==")},u=e=>{let t="";for(var r,o=e.length,n=0;n<o;n++)r=e[n],t+=String.fromCodePoint(r>251&&r<254&&n+5<o?1073741824*(r-252)+(e[++n]-128<<24)+(e[++n]-128<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:r>247&&r<252&&n+4<o?(r-248<<24)+(e[++n]-128<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:r>239&&r<248&&n+3<o?(r-240<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:r>223&&r<240&&n+2<o?(r-224<<12)+(e[++n]-128<<6)+e[++n]-128:r>191&&r<224&&n+1<o?(r-192<<6)+e[++n]-128:r);return t},p=e=>{for(var t,r,o=e.length,n=0,s=0;s<o;s++)(r=e.codePointAt(s))>65536&&s++,n+=r<128?1:r<2048?2:r<65536?3:r<2097152?4:r<67108864?5:6;t=new Uint8Array(n);for(var a=0,i=0;a<n;i++)(r=e.codePointAt(i))<128?t[a++]=r:r<2048?(t[a++]=192+(r>>>6),t[a++]=128+(63&r)):r<65536?(t[a++]=224+(r>>>12),t[a++]=128+(r>>>6&63),t[a++]=128+(63&r)):r<2097152?(t[a++]=240+(r>>>18),t[a++]=128+(r>>>12&63),t[a++]=128+(r>>>6&63),t[a++]=128+(63&r),i++):r<67108864?(t[a++]=248+(r>>>24),t[a++]=128+(r>>>18&63),t[a++]=128+(r>>>12&63),t[a++]=128+(r>>>6&63),t[a++]=128+(63&r),i++):(t[a++]=252+(r>>>30),t[a++]=128+(r>>>24&63),t[a++]=128+(r>>>18&63),t[a++]=128+(r>>>12&63),t[a++]=128+(r>>>6&63),t[a++]=128+(63&r),i++);return t},m=(e,t)=>{const r=new Array(t);for(let o=t-1;o>=0;o--)r[o]=255&e,e>>=8;return r},h=e=>{const t=[];let r=!0;do{const o=127&e;e>>=7,r?(t.unshift(o),r=!1):t.unshift(128|o)}while(e>0);return t}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f4L6P"}]},["4sCyq"],"4sCyq");