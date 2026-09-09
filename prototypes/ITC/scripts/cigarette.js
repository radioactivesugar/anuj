// scripts/cigarette.js — QW4K11

document.addEventListener("DOMContentLoaded", function () {
    const revenueDom = document.getElementById('QW4K11-revenue-chart');
    const profitDom = document.getElementById('QW4K11-profit-chart');
    const legendDom = document.getElementById('QW4K11-legend');
    if (!revenueDom || !profitDom) return;

    const revenueChart = echarts.init(revenueDom);
    const profitChart = echarts.init(profitDom);

    function getColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    const years = ['FY23', 'FY24', 'FY25', 'FY26'];

    // FY23/FY24 source data (market.png) reports Hotels as its own segment,
    // but Inter-Segment Revenue and Other Adjustments are folded together
    // with the legacy FY25/FY26 "Others / Inter-segment Adjustments" bucket
    // into one combined "Others" series (matches the original FY25/FY26 model).
    const categories = ['Cigarettes', 'Other FMCG', 'Agri Business', 'Paper & Packaging', 'Hotels', 'Others'];
    const shortNames = {
        'Cigarettes': 'Cigarettes',
        'Other FMCG': 'Other FMCG',
        'Agri Business': 'Agri Business',
        'Paper & Packaging': 'Paper & Packaging',
        'Hotels': 'Hotels',
        'Others': 'Others / Adj.'
    };

    // Bar look/colors are the chart's own data-encoding (cigarettes highlighted
    // amber, other segments in neutral greys, net adjustments in red) and are
    // kept exactly as authored in the source prototype — not tokenized.
    const seriesStyle = {
        'Cigarettes':          { color: '#d97706', borderColor: '#b45309' },
        'Other FMCG':          { color: '#fafaf9', borderColor: '#e4e4e7' },
        'Agri Business':       { color: '#e7e5e4', borderColor: '#d4d4d8' },
        'Paper & Packaging':   { color: '#d6d3d1', borderColor: '#d4d4d8' },
        'Hotels':              { color: '#c9c2b8', borderColor: '#a89f92' },
        'Others':              { color: '#dc2626', borderColor: '#b91c1c' }
    };

    // Revenue and profit used to share one combined chart (Rev, Profit, spacer,
    // Rev, Profit, spacer, ...) — split into two separate charts per feedback,
    // one per metric, each a plain 4-year (FY23-26) series with no spacers needed.
    const revenueTotals = [69481, 69446, 73467, 80868];
    const profitTotals = [24750, 26316, 26531, 26768];

    const revenueData = {
        'Cigarettes':        [28207, 30597, 32631, 37100],
        'Other FMCG':        [19123, 20967, 21982, 24210],
        'Agri Business':     [18172, 15792, 19754, 20296],
        'Paper & Packaging': [9081, 8344, 8423, 8766],
        'Hotels':            [2585, 2990, 0, 0],
        'Others':            [-7687, -9243, -9323, -9504]
    };
    const profitData = {
        'Cigarettes':        [17927, 19089, 20025, 21051],
        'Other FMCG':        [1374, 1779, 1580, 1803],
        'Agri Business':     [1328, 1254, 1478, 1496],
        'Paper & Packaging': [2294, 1378, 911, 797],
        'Hotels':            [542, 754, 0, 0],
        'Others':            [1285, 2062, 2537, 1621]
    };

    function buildOption(dataSet, totals, isProfit) {
        const mobile = isMobile();

        // Revenue and Profit share one fixed scale on desktop so bar heights
        // stay directly comparable across the two charts. On mobile, screen
        // space is tighter and that comparability matters less than legibility,
        // so the profit chart (much smaller values) gets its own tighter scale.
        const useCompactScale = mobile && isProfit;
        const yAxisRange = useCompactScale
            ? { min: 0, max: 30000, interval: 10000 }
            : { min: -20000, max: 100000, interval: 20000 };

        const series = categories.map(function (cat) {
            const style = seriesStyle[cat];
            const isFirst = cat === 'Cigarettes';
            // the last series drawn caps the stack — gets the rounded top
            // and bold white label
            const isCapping = cat === 'Others';

            return {
                name: cat,
                type: 'bar',
                stack: 'Total',
                barWidth: isFirst ? (mobile ? '55%' : '45%') : undefined,
                itemStyle: {
                    color: style.color,
                    borderColor: style.borderColor,
                    borderWidth: 1,
                    borderRadius: 0
                },
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: isFirst || isCapping ? '#ffffff' : getColor('--color-muted'),
                        fontSize: isFirst ? (mobile ? 11 : 12) : 10,
                        fontWeight: isFirst || isCapping ? 'bold' : '600'
                    },
                    formatter: function (params) {
                        // on web, the profit chart's segments (much smaller
                        // absolute values than revenue's) are too thin a stack
                        // for their % labels to fit without overlapping —
                        // only Cigarettes is tall enough to keep its label
                        if (!mobile && isProfit && !isFirst) return '';
                        const total = totals[params.dataIndex];
                        if (total === 0) return '';
                        // threshold as a share of that bar's total, not a fixed
                        // absolute value — revenue and profit segments sit on very
                        // different scales, so a flat cutoff hid nearly every
                        // profit segment (only Cigarettes/Others cleared it)
                        const minShare = isFirst ? 0 : (isCapping ? 0.015 : 0.025);
                        if (Math.abs(params.value) < total * minShare) return '';
                        const pct = Math.round((params.value / total) * 100);
                        return pct + '%';
                    }
                },
                data: dataSet[cat]
            };
        });

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderWidth: 1,
                borderColor: '#ccc',
                textStyle: { color: '#333', fontSize: mobile ? 11 : 13 },
                formatter: function (params) {
                    const title = params[0].axisValue;
                    let html = '<b>' + title + '</b><br/>';
                    let total = 0;
                    params.forEach(function (item) {
                        if (item.value !== 0) {
                            html += item.marker + ' ' + item.seriesName + ': <b>Rs. ' + item.value.toLocaleString() + ' cr</b><br/>';
                            total += item.value;
                        }
                    });
                    html += '<hr style="margin:5px 0;border:0;border-top:1px solid #e2e8f0;"/>';
                    html += 'Gross Total: <b>Rs. ' + total.toLocaleString() + ' cr</b>';
                    return html;
                }
            },
            legend: { data: categories, show: false },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '4%',
                // extra top padding vs. before — containLabel doesn't
                // account for the yAxis "Rs Crore" name's own bounding box,
                // so without headroom it clips against the container edge
                top: mobile ? '14%' : '10%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: years,
                axisTick: { alignWithLabel: true },
                axisLabel: {
                    color: getColor('--color-text'),
                    fontSize: mobile ? 10 : 12,
                    fontWeight: '600'
                }
            }],
            // fixed (not auto-scaled) and identical on both charts — Revenue
            // and Profit used to be one combined chart, and sharing a scale
            // is what keeps their gridlines/baseline aligned now that
            // they're split, so bar heights stay directly comparable
            // between the two even though profit's own values are smaller
            yAxis: [{
                type: 'value',
                min: yAxisRange.min,
                max: yAxisRange.max,
                interval: yAxisRange.interval,
                name: 'Rs Crore',
                nameLocation: 'end',
                nameGap: 12,
                nameTextStyle: {
                    color: getColor('--color-muted'),
                    fontSize: mobile ? 10 : 12,
                    // nameLocation:'end' starts the name at the axis line by
                    // default — the tick numbers sit to the left of it, so a
                    // negative left padding pulls "Rs Crore" back over that
                    // same label column instead of floating past the axis
                    align: 'left',
                    padding: [0, 0, 0, mobile ? -54 : -70]
                },
                axisLabel: { color: getColor('--color-muted') },
                splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
            }],
            series: series
        };
    }

    const legendItemEls = {};

    function buildLegend() {
        if (!legendDom) return;
        legendDom.innerHTML = '';

        categories.forEach(function (cat) {
            const item = document.createElement('div');
            item.className = 'QW4K11-legend-item';

            const dot = document.createElement('span');
            dot.className = 'QW4K11-legend-dot';
            dot.style.backgroundColor = seriesStyle[cat].color;

            const label = document.createElement('span');
            label.textContent = shortNames[cat] || cat;

            item.appendChild(dot);
            item.appendChild(label);
            item.addEventListener('click', function () {
                // one shared legend drives both charts, so a toggle here
                // needs to be dispatched to both instances to stay in sync
                revenueChart.dispatchAction({ type: 'legendToggleSelect', name: cat });
                profitChart.dispatchAction({ type: 'legendToggleSelect', name: cat });
            });

            legendDom.appendChild(item);
            legendItemEls[cat] = item;
        });
    }

    revenueChart.on('legendselectchanged', function (params) {
        categories.forEach(function (cat) {
            const el = legendItemEls[cat];
            if (el) el.classList.toggle('is-inactive', !params.selected[cat]);
        });
    });

    buildLegend();
    revenueChart.setOption(buildOption(revenueData, revenueTotals, false));
    profitChart.setOption(buildOption(profitData, profitTotals, true));

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        revenueChart.resize();
        profitChart.resize();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            revenueChart.setOption(buildOption(revenueData, revenueTotals, false), true);
            profitChart.setOption(buildOption(profitData, profitTotals, true), true);
            buildLegend();
        }, 150);
    });
});
