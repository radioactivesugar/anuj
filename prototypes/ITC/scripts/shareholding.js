// scripts/shareholding.js

document.addEventListener("DOMContentLoaded", function () {
    // 1. DOM reference
    const chartDom = document.getElementById('QW4K1-main-chart');
    const legendDom = document.getElementById('QW4K1-legend');
    if (!chartDom) return;

    // 2. Library init
    const myChart = echarts.init(chartDom);

    // 3. Data configuration — from BAT_holdings2.csv. Post-2020 the source is
    // quarterly (Sep-23 through Jun-26); per feedback we only keep Mar-24,
    // Mar-25, Mar-26 and Jun-26 and drop the rest of the quarters.
    const timeline = ["1950", "1954", "1970", "1974", "1976", "1985", "1993", "2001", "2005", "2010", "2011", "2020", "2024", "2025", "2026"];

    const fullFormMap = {
        'BAT': 'BAT (British American Tobacco) entities',
        'Other FIIs': 'Foreign Institutional Investors (FIIs)',
        'DIIs': 'Domestic Institutional Investors (DIIs)',
        'Public': 'Public Shareholders (Retail)'
    };

    // Static entity rosters from the source sheet (informational — the sheet
    // doesn't give a per-period breakdown at this granularity, only each
    // category's total, so this list isn't filtered by which period is shown)
    const entityRoster = {
        'BAT': ['Tobacco Manufacturers (India) Limited', 'Myddleton Investment Company Limited', 'Rothmans International Enterprises Limited'],
        'Other FIIs': ['GQG Partners Emerging Markets Equity Fund', 'Goldman Sachs Trust II - Goldman Sachs GQG', 'Government of Singapore', 'and other foreign institutional investors'],
        'DIIs': ['Life Insurance Corporation of India', 'Specified Undertaking of the Unit Trust of India', 'General Insurance Corporation of India', 'The New India Assurance Company Limited', 'The Oriental Insurance Company Limited', 'SBI / ICICI Prudential / HDFC / UTI / Nippon / Mirae / Parag Parikh Mutual Funds', 'NPS Trust (various Pension Funds)'],
        'Public': ['Retail shareholders']
    };

    const categories = ['BAT', 'Other FIIs', 'DIIs', 'Public'];
    const shortNames = {
        'BAT': 'BAT',
        'Other FIIs': 'Other Foreign Institutional Investors',
        'DIIs': 'Domestic Institutional Investors',
        'Public': 'Public Shareholders'
    };

    const rawData = {
        // 1950 has no recorded FII/DII/Public split at all — BAT alone
        // accounted for the full 100%, so the other three are genuinely 0.
        'BAT':       [100, 93, 75, 60, 40, 33, 32, 33, 32, 32, 31, 31, 26, 25, 23, 23],
        'Other FIIs': [0,   0,  0,  0,  0,  0,  0, 11, 17, 13, 14, 15, 15, 14, 12, 11],
        'DIIs':       [0,   0, 10, 19, 28, 34, 38, 35, 34, 37, 36, 40, 44, 45, 49, 49],
        'Public':     [0,   7, 15, 21, 32, 33, 30, 21, 16, 18, 19, 14, 15, 16, 16, 17]
    };

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function hexToRgba(hex, alpha) {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    // BAT and Other FIIs share the primary (gold) hue — same foreign-investor
    // family, BAT solid since it's the focus of the chart, Other FIIs a
    // lighter tint. DIIs and Public each get their own solid color.
    function getDesignSystemColors() {
        const primary = '#d4aa3d';
        const secondary = '#2d3e8a';
        const accent = '#2a9d8f';
        return [
            primary,
            hexToRgba(primary, 0.5),
            secondary,
            accent
        ];
    }

    function tooltipPosition(point, params, dom, rect, size) {
        let x = point[0] - size.contentSize[0] / 2;
        x = Math.max(10, Math.min(x, size.viewSize[0] - size.contentSize[0] - 10));
        const y = size.viewSize[1] - size.contentSize[1] - 10;
        return [x, Math.max(10, y)];
    }

    // the dot swatch uses each series' own color, which for "Other FIIs" is
    // a light 0.5-alpha tint that reads too faint for the bold category
    // text next to it — the text instead uses a fixed solid color per family
    const textColorByCat = {
        'BAT': '#d4aa3d',
        'Other FIIs': '#d4aa3d',
        'DIIs': '#2d3e8a',
        'Public': '#2a9d8f'
    };

    function tooltipFormatter(param, desktop) {
        const catName = param.seriesName;
        const catTotal = param.value;
        const catColor = param.color;
        const textColor = textColorByCat[catName] || '#1a1a32';

        if (catTotal === 0) return '';

        const fullTitle = fullFormMap[catName] || catName;

        const headerSize = desktop ? '14px' : '13px';
        const catSize = desktop ? '14px' : '13px';
        const labelSize = desktop ? '12px' : '0.95em';
        const listSize = desktop ? '12.5px' : '0.9em';
        const listMaxWidth = desktop ? '340px' : '220px';
        const dotSize = desktop ? '10px' : '8px';
        // caps the WHOLE tooltip's width on mobile (not just the <ul>) so a
        // long unbroken category name can't force the box wider than the
        // screen — every line inside inherits the wrap from this container
        const outerMaxWidth = desktop ? '360px' : '240px';

        let tooltipHtml = `
            <div style="max-width: ${outerMaxWidth}; white-space: normal; overflow-wrap: break-word;">
            <div style="font-weight: 500; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-size: ${headerSize}; color: #888;">
                As of ${param.name}
            </div>
            <div style="margin-bottom: 6px; font-size: ${catSize};">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:${dotSize};height:${dotSize};background-color:${catColor};"></span>
                <strong style="color:${textColor}">${fullTitle}: ${catTotal.toFixed(2)}%</strong>
            </div>
            <div style="margin-top: 3px; color:#666; font-size: ${labelSize}; padding-left: 4px;">Includes:</div>
            <ul style="margin: 3px 0 0 0; padding-left: 16px; font-size: ${listSize}; color: #444; max-width: ${listMaxWidth}; white-space: normal; overflow-wrap: break-word; line-height: 1.4em; list-style-type: disc;">
        `;

        (entityRoster[catName] || []).forEach(function (name) {
            tooltipHtml += `<li style="margin-bottom: 2px; display: list-item;">${name}</li>`;
        });

        tooltipHtml += `</ul></div>`;
        return tooltipHtml;
    }

    function buildOption() {
        const mobile = isMobile();
        const desktop = window.innerWidth > 1023;
        const colors = getDesignSystemColors();

        const series = categories.map((cat, idx) => {
            return {
                name: cat,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                itemStyle: { color: colors[idx] },
                barWidth: '75%',
                barGap: '5%',
                label: {
                    show: !mobile,
                    position: 'inside',
                    formatter: function (params) {
                        return params.value > 3 ? params.value.toFixed(0) + '%' : '';
                    },
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                data: rawData[cat]
            };
        });

        const tooltipConfig = {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderWidth: 1,
            borderColor: '#ccc',
            textStyle: { color: '#333', fontSize: desktop ? 14 : 11 },
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.1)',
            confine: true,
            formatter: function (param) {
                return tooltipFormatter(param, desktop);
            }
        };
        // Desktop: follow the cursor (default echarts behavior, kept inside the chart via confine).
        // iPad/mobile: hover isn't a real gesture there, so pin the tooltip to the chart's bottom edge to avoid clipping.
        if (!desktop) {
            tooltipConfig.position = tooltipPosition;
        }

        return {
            tooltip: tooltipConfig,
            legend: {
                data: categories,
                show: false
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: mobile ? '18%' : '5%',
                top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeline,
                axisLabel: {
                    rotate: mobile ? 90 : 45,
                    interval: 0,
                    fontSize: 12,
                    color: '#333',
                    fontWeight: '500'
                },
                axisTick: { alignWithLabel: true }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: { formatter: '{value}%', fontSize: 12 }
            },
            series: series
        };
    }

    // 4. Custom HTML legend — lives in the chart header, toggles series via echarts' hidden legend model
    const legendItemEls = {};

    function buildLegend() {
        if (!legendDom) return;
        legendDom.innerHTML = '';

        categories.forEach(function (cat) {
            const item = document.createElement('div');
            item.className = 'QW4K1-legend-item';

            const dot = document.createElement('span');
            dot.className = 'QW4K1-legend-dot';
            const colors = getDesignSystemColors();
            dot.style.backgroundColor = colors[categories.indexOf(cat)];

            const label = document.createElement('span');
            label.textContent = shortNames[cat] || cat;

            item.appendChild(dot);
            item.appendChild(label);
            item.addEventListener('click', function () {
                myChart.dispatchAction({ type: 'legendToggleSelect', name: cat });
            });

            legendDom.appendChild(item);
            legendItemEls[cat] = item;
        });
    }

    myChart.on('legendselectchanged', function (params) {
        categories.forEach(function (cat) {
            const el = legendItemEls[cat];
            if (el) el.classList.toggle('is-inactive', !params.selected[cat]);
        });
    });

    // 5. Render
    buildLegend();
    myChart.setOption(buildOption());

    // 6. Layout updates
    let resizeTimer = null;
    window.addEventListener('resize', function () {
        myChart.resize();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            myChart.setOption(buildOption(), true);
            buildLegend();
        }, 150);
    });
});
