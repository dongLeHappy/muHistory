<template>
    <div>
        <p :class="className" :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}">
            <span v-cloak :id="idName">{{ startVal }}</span>
            <span>{{ unit }}</span></p>
        <slot name="intro"></slot>
    </div>
</template>

<script>
import CountUp from 'countup';

function transformValue (val) {
    let endVal = 0;
    let unit = '';
//    if (val < 1000) {
//        endVal = val;
//    } else if (val >= 1000 && val < 1000000) {
//        endVal = parseInt(val / 1000);
//        unit = 'K+';
//    } else if (val >= 1000000 && val < 10000000000) {
//        endVal = parseInt(val / 1000000);
//        unit = 'M+';
//    } else {
//        endVal = parseInt(val / 1000000000);
//        unit = 'B+';
//    }
    endVal = val;
    return {
        val: endVal,
        unit: unit
    };
}

export default {
    data () {
        return {
            unit: '',
            demo: {}
        };
    },
    name: 'countUp',
    props: {
        idName: String,
        className: String,
        startVal: {
            type: Number,
            default: 0
        },
        endVal: {
            type: Number,
            required: true
        },
        decimals: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 3
        },
        delay: {
            type: Number,
            default: 500
        },
        options: {
            type: Object,
            default: () => {
                return {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.'
                };
            }
        },
        color: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        introText: [String, Number]
    },
    mounted () {
        let self = this;
        self.$nextTick(() => {
            setTimeout(() => {
                let res = transformValue(self.endVal);
                let endVal = res.val;
                self.unit = res.unit;
                let demo = {};

                self.demo = demo = new CountUp(self.idName, self.startVal, endVal, self.decimals, self.duration, self.options);
                if (!demo.error) {
                    demo.start();
                }
            }, self.delay);
        });
    },
    watch: {
        endVal (val) {
            let self = this;
            let res = transformValue(val);
            let endVal = res.val;
            self.unit = res.unit;
            let demo = {};
            setTimeout(() => {
                self.demo.update(endVal);
            }, self.delay+50)
        }
    }
};
</script>
