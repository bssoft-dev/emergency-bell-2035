(function ($) {
    'use strict';
    $(function () {
        var primaryColor = getComputedStyle(document.body).getPropertyValue('--primary');
        var secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary');
        var successColor = getComputedStyle(document.body).getPropertyValue('--success');
        var warningColor = getComputedStyle(document.body).getPropertyValue('--warning');
        var dangerColor = getComputedStyle(document.body).getPropertyValue('--danger');
        var infoColor = getComputedStyle(document.body).getPropertyValue('--info');
        var darkColor = getComputedStyle(document.body).getPropertyValue('--dark');
        var lightColor = getComputedStyle(document.body).getPropertyValue('--light');

        
        

        if ($("#realtime-statistics").length) {
            var realtimeChartCanvas = $("#realtime-statistics").get(0).getContext("2d");
            var realtimeChart = new Chart(realtimeChartCanvas, {
                type: 'bar',
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [{
                            label: 'Profit',
                            data: [330, 380, 230, 400, 309, 530, 340, 400, 490, 380, 300, 510],
                            backgroundColor: primaryColor
                        },
                        {
                            label: 'Target',
                            data: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
                            backgroundColor: 'rgba(238, 242, 245, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            display: false,
                            gridLines: {
                                display: false
                            }
                        }],
                        xAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#354168"
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                                display: false
                            },
                            barPercentage: 0.4
                        }]
                    },
                    legend: {
                        display: false
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }
                }
            });
        }

        if ($("#humanResouceDoughnutChart").length) {
            var doughnutChartCanvas = $("#humanResouceDoughnutChart").get(0).getContext("2d");
            var doughnutPieData = {
                datasets: [{
                    data: [20, 80, 85, 45],
                    backgroundColor: [
                        successColor,
                        primaryColor,
                        dangerColor,
                        secondaryColor
                    ],
                    borderColor: [
                        successColor,
                        primaryColor,
                        dangerColor,
                        secondaryColor
                    ],
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Human Resources',
                    'Manger',
                    'Other'
                ]
            };
            var doughnutPieOptions = {
                cutoutPercentage: 75,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                responsive: true,
                maintainAspectRatio: true,
                showScale: true,
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            };
            var doughnutChart = new Chart(doughnutChartCanvas, {
                type: 'doughnut',
                data: doughnutPieData,
                options: doughnutPieOptions
            });
        }

        
    });
})(jQuery)