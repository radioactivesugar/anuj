// scripts/smoke75.js — QW4K75 (duplicate of QW4K7: grouped bar comparison,
// no revenue line — cigarette tax as a share of per-capita GDP, by country)
//
// Bars are styled and animated exactly like QW4K7's cigarette bars (filter/
// body/burning-tip stack + particle smoke on hover) — see scripts/smoke.js
// for the original this was forked from — but each "cigarette" here is a
// single country's tax value rather than a year-over-year revenue stack,
// and the bars are grouped by report year (x-axis) with one cigarette per
// country clustered inside each year.

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById('QW4K75-main-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    // The legend is a plain HTML/CSS cigarette swatch (.QW4K75-legend-cig)
    // now, not an ECharts instance — a flat color chip couldn't convey the
    // filter/body/tip look the way a real swatch shape can.

    function getColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const textColor = getColor('--color-text');
    const mutedColor = getColor('--color-muted');
    const bgColor = getColor('--color-bg');
    const isMobile = window.innerWidth <= 768;
    const cigaretteBarWidth = isMobile ? 10 : 26;
    const clusterBarGap = isMobile ? '35%' : '110%';
    const clusterCategoryGap = isMobile ? '30%' : '65%';

    // Tax on 2000 cigarettes as a % of per-capita GDP — WHO Global Health
    // Observatory, three report vintages (each reporting on a different year).
    const years = ['2018', '2022', '2024'];
    const totals = {
        UK:    [2.31, 2.30, 2.63],
        India: [7.34, 5.71, 4.90],
        USA:   [0.47, 0.40, 0.36],
        China: [1.20, 1.00, 1.00]
    };
    // tallest-to-shortest, by average across the three years (the ranking
    // happens to hold for every individual year in this dataset too)
    function average(arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; }
    const countries = Object.keys(totals).sort(function (a, b) { return average(totals[b]) - average(totals[a]); });

    // Decorative filter/body/tip split — same proportions as QW4K7's
    // cigarette bars, purely visual; the three segments always sum back
    // to that country's real value for the year.
    function part(fraction) {
        const out = {};
        countries.forEach(function (c) {
            out[c] = totals[c].map(function (v) { return v * fraction; });
        });
        return out;
    }
    const filterData = part(0.25);
    const bodyData = part(0.70);
    const tipData = part(0.05);

    function buildCountrySeries(country) {
        return [
            {
                name: country + ' Filter',
                type: 'bar',
                stack: country,
                barWidth: cigaretteBarWidth,
                data: filterData[country],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#d97706' },
                        { offset: 0.2, color: '#fbbf24' },
                        { offset: 0.8, color: '#fbbf24' },
                        { offset: 1, color: '#b45309' }
                    ]),
                    borderRadius: [0, 0, 2, 2]
                }
            },
            {
                name: country + ' Body',
                type: 'bar',
                stack: country,
                data: bodyData[country],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#e2e8f0' },
                        { offset: 0.2, color: '#ffffff' },
                        { offset: 0.8, color: '#ffffff' },
                        { offset: 1, color: '#cbd5e1' }
                    ]),
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                },
                label: {
                    show: !isMobile,
                    position: 'inside',
                    color: '#b3b3c0',
                    fontSize: 10,
                    fontWeight: '500',
                    formatter: function (params) {
                        return totals[country][params.dataIndex] ;
                    }
                }
            },
            {
                name: country + ' Tip',
                type: 'bar',
                stack: country,
                data: tipData[country],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#94a3b8' },
                        { offset: 0.4, color: '#f43f5e' },
                        { offset: 1, color: '#f97316' }
                    ]),
                    borderRadius: [2, 2, 0, 0],
                    shadowBlur: 8,
                    shadowColor: '#f43f5e'
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 8,
                    color: mutedColor,
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 'bold',
                    formatter: function () { return country; }
                }
            }
        ];
    }

    // Flat list of all 12 series (4 countries × filter/body/tip), in a
    // known order so hover math below can map a hovered segment back to
    // its country's "tip" series (for smoke placement) by simple index math.
    const allSeries = countries.reduce(function (acc, c) { return acc.concat(buildCountrySeries(c)); }, []);
    const SERIES_PER_COUNTRY = 3;

    const mainOption = {
        backgroundColor: 'transparent',
        legend: { show: false },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'none' },
            backgroundColor: bgColor,
            borderColor: mutedColor,
            borderWidth: 1,
            padding: 12,
            textStyle: { color: textColor },
            formatter: function (params) {
                const idx = params[0].dataIndex;
                let html = '<b>' + years[idx] + '</b><br/>';
                countries.forEach(function (c) {
                    html += '<span style="color:' + mutedColor + '">' + c + ': <b>' + totals[c][idx] + '%</b></span><br/>';
                });
                return html;
            }
        },
        grid: { left: '4%', right: '4%', bottom: '5%', top: '12%', containLabel: true },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { color: mutedColor, fontSize: 12, margin: 16, fontWeight: 600 },
            axisLine: { lineStyle: { color: mutedColor } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: mutedColor, formatter: '{value}%' },
            splitLine: { lineStyle: { color: mutedColor, opacity: 0.15, type: 'solid' } }
        },
        // wider gaps: more room between each country's cigarette within a
        // year group, and between the year groups themselves. barGap is
        // relative to barWidth (e.g. '110%' = a gap 1.1x the bar's own
        // width) — bump this value directly to spread the cluster further;
        // barCategoryGap is the equivalent gap between the 2018/2022/2024
        // groups themselves. Both are tighter on mobile, where there's far
        // less horizontal room for 4 bars per year group.
        barGap: clusterBarGap,
        barCategoryGap: clusterCategoryGap,
        series: allSeries,
        graphic: []
    };

    myChart.setOption(mainOption);

    // Particle Smoke Engine Elements (ported from QW4K7 — see scripts/smoke.js)
    let smokeParticles = [];
    let animationFrameId = null;
    let activeEmitterX = null;
    let activeEmitterY = null;

    function updateSmoke() {
        if (activeEmitterX !== null && Math.random() < 0.35) {
            smokeParticles.push({
                x: activeEmitterX + (Math.random() * 4 - 2),
                y: activeEmitterY,
                radius: 4 + Math.random() * 4,
                opacity: 0.28 + Math.random() * 0.08,
                vx: (Math.random() * 0.4 - 0.2),
                vy: -(0.9 + Math.random() * 0.7)
            });
        }

        smokeParticles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            p.radius += 0.35;
            p.opacity -= 0.0005;
            p.vx += (Math.random() * 0.1 - 0.05);
        });

        smokeParticles = smokeParticles.filter(function (p) { return p.opacity > 0 && p.radius < 55; });

        const graphicElements = smokeParticles.map(function (p, index) {
            return {
                id: 'smoke_p_' + index,
                type: 'circle',
                shape: { cx: p.x, cy: p.y, r: p.radius },
                style: {
                    fill: 'rgba(203, 213, 225, ' + Math.max(0, p.opacity) + ')',
                    shadowBlur: 35,
                    shadowColor: 'rgba(148, 163, 184, ' + Math.max(0, p.opacity * 2) + ')'
                },
                silent: true
            };
        });

        myChart.setOption({ graphic: graphicElements }, { replaceMerge: ['graphic'] });
        animationFrameId = requestAnimationFrame(updateSmoke);
    }

    myChart.on('mouseover', function (params) {
        if (params.componentType !== 'series') return;
        const countryIdx = Math.floor(params.seriesIndex / SERIES_PER_COUNTRY);
        const country = countries[countryIdx];
        if (!country) return;
        const tipSeriesIndex = countryIdx * SERIES_PER_COUNTRY + 2;
        // convertToPixel only gives the category axis's nominal x (it doesn't
        // know about this series' own horizontal offset within a grouped
        // cluster of bars) — the real mouse position is guaranteed to be on
        // the hovered bar itself, so use that for x instead. y doesn't have
        // this problem since it's purely value-based, independent of offset.
        const coord = myChart.convertToPixel({ seriesIndex: tipSeriesIndex }, [params.dataIndex, totals[country][params.dataIndex]]);
        const cursorX = params.event && typeof params.event.offsetX === 'number' ? params.event.offsetX : (coord && coord[0]);
        if (coord && !isNaN(coord[1]) && typeof cursorX === 'number' && !isNaN(cursorX)) {
            activeEmitterX = cursorX;
            activeEmitterY = coord[1] + 2;
            if (!animationFrameId) updateSmoke();
        }
    });

    myChart.on('mouseout', function () {
        activeEmitterX = null;
        activeEmitterY = null;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        smokeParticles = [];
        myChart.setOption({ graphic: [] }, { replaceMerge: ['graphic'] });
    });

    window.addEventListener('resize', function () {
        myChart.resize();
    });
});
