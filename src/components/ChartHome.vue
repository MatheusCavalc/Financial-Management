<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const props = defineProps(['values'])

const mesAtual = new Date().getMonth() + 1;
const dates: Array<string> = ['07/' + mesAtual, '14/' + mesAtual, '21/' + mesAtual, '28/' + mesAtual];

const options = (labels: Array<string>) => {
    return {
        chart: {
            height: 280,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            colors: '#ffffff',
            width: 3,
            dashArray: 0,
        },
        grid: {
            borderColor: '#ffffff',
            position: 'back',
            row: {
                colors: ['#059669', '#059669', '#059669', '#059669', '#059669'], // takes an array which will be repeated on columns
                opacity: 1
            },
            show: false
        },
        xaxis: {
            categories: labels,
            labels: {
                style: {
                    colors: '#ffffff',
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#ffffff',
                }
            },
        },
        markers: {
            size: 6,
            colors: '#fff',
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
                size: undefined,
                sizeOffset: 3
            }
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            fillSeriesColor: false,
            theme: false,
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            marker: {
                show: false,
            }
        }
    }
}

const series = [{
    name: 'Value($)',
    data: props.values
}]
</script>

<template>
    <div class="bg-emerald-600 py-3">
        <VueApexCharts type="line" height="280" :options="options(dates)" :series="series"></VueApexCharts>
    </div>
</template>

<style>
.apexcharts-tooltip {
    background: #f3f3f3;
    color: #059669;
    border-color:black;
}

.apexcharts-xaxistooltip {
    background: white;
    border: none;
    color: #059669;
    margin-top: 4px;
    padding-bottom: 0;
    font-weight: bold;
}

.apexcharts-tooltip-marker {
    color: white;
}
</style>
