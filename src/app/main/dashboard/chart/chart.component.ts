import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
// import WaveSurfer from 'wavesurfer.js';

declare var WaveSurfer;
declare const AmCharts: any;
declare let i: 0;
declare var myBarChart;

import 'src/assets/amchart/amcharts.js';
import 'src/assets/amchart/serial.js';
import 'src/assets/amchart/light.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  screamhsla = 'hsla(5, 100%, 50%, 0.5)';
  sliphsla = 'hsla(150, 100%, 30%, 0.5)';
  helphsla = 'hsla(80, 100%, 30%, 0.5)';
  violenthsla = 'hsla(300, 100%, 30%, 0.5)';

  // 소리 정보
  annotations = [
    {
      name: '낙상',
      start: 0,
      end: 5,
      loop: false,
      color: this.screamhsla,
      comment: '출동완료',
    },
    {
      name: '비명',
      start: 6,
      end: 10,
      loop: false,
      color: this.sliphsla,
      comment: '출동완료',
    },
    {
      name: '도움요청',
      start: 12,
      end: 15,
      loop: false,
      color: this.helphsla,
      comment: '확인중',
    },
    {
      name: '비명',
      start: 16,
      end: 20,
      loop: false,
      color: this.violenthsla,
      comment: '출동완료',
    },
    {
      name: '비명',
      start: 32,
      end: 38,
      loop: false,
      color: this.screamhsla,
      comment: '출동완료',
    },
    {
      name: '비명',
      start: 50,
      end: 60,
      loop: false,
      color: this.sliphsla,
      comment: '출동완료',
    },
  ];

  siteid = 'ttat1120';
  sitename = 'TTA 테스트지역';
  sitecase = 'SCREAM';
  date = new Date();

  wavetext = '';

  chartType = 0;

  userId;

  NoBells = 0;
  NoBellsMonth = 0;
  NoBellsSite = {};
  NoEvents = 0;
  NoEventsMonth = 0;

  NoInstallation = 0;
  NoInstallationMonth = 0;

  NoCases = 0;
  NoCasesMonth = 0;

  casePercent = {
    reported: 0,
    detected: 0,
    'false alarm': 0,
  };

  caseList = [];

  siteList = [];
  siteIdList = [];
  deviceList = [];

  isUpdated = 0;

  detectedCaseChart;

  logs = [];

  devices = {};
  sites = {};

  detectionList = [];
  logList = [];
  wavesurfer;

  @Input() noticeList = [];

  // noticeListUrl =
  //   'http://smartbell_backup.bs-soft.co.kr/assets/annotation/sample.json';
  noticeListUrl = 'http://api-2035.bs-soft.co.kr/v3/recent-analysis/';
  ingnoreEventList = ['Microwave_oven', 'Fart'];
  constructor(public http: HttpClient) {}

  ngOnInit() {}

  randomColor(alpha): string {
    return (
      'rgba(' +
      [
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        alpha || 1,
      ] +
      ')'
    );
  }

  saveRegions() {
    localStorage.regions = JSON.stringify(
      Object.keys(this.wavesurfer.regions.list).map(function (id) {
        let region = this.wavesurfer.regions.list[id];
        return {
          start: region.start,
          end: region.end,
          attributes: region.attributes,
          data: region.data,
        };
      })
    );
  }

  loadRegions(regions) {
    regions.forEach(function (region) {
      console.log(region);
      // region.color = this.randomColor(0.1);
      this.wavesurfer.addRegion(region);
    });
  }

  regionPlay() {}

  // play/pause 버튼 클릭
  playPause(log) {
    console.log(log);
    if (log != null) {
      if (log.soundurl != null && this.wavesurfer != null) {
        this.wavesurfer.load(log.soundurl);
        this.wavesurfer.playPause();
      }
      this.wavetext = log.result.text;
    } else {
      this.wavesurfer.playPause();
    }
  }

  situationList = [
    'abandoned_dog', // 4
    'animalcruelty', // 3
    'bees', // 4
    'crying_woman', // 3
    'ferocious', // 2
    'fire_detector', // 4
    'gunshot_or_gunfire', // 0
    'hidden_camera', // 1
    'normal', // 5
    'sexual_violence', // 0
    'stray_child', // 3
    'vandalism', // 1
  ];
  eventList = [
    'accordion',
    'acousitc_guitar',
    'applause',
    'bass_drum',
    'burping_or_eructation',
    'chello',
    'chewing_and_mastication',
    'chime',
    'chink_and_clink',
    'clarinet',
    'computer_keyboard',
    'cough',
    'cowbell',
    'couble_bass',
    'drawer_open_or_close',
    'electric_guitar',
    'electric_piano',
    'fart',
    'finger_snapping',
    'fireworks',
    'flute',
    'gasp',
    'glockenspiel',
    'gong',
    'harmonica',
    'hi-hat',
    'knock',
    'laughter',
    'marimba_and_xylophone',
    'meow',
    'microwave_oven',
    'motocycle',
    'oboe',
    'printer',
    'purr',
    'run',
    'samsophone',
    'scissors',
    'sigh',
    'snare_drum',
    'squeak',
    'tambourine',
    'toilet_flush',
    'trickle_and_dribble',
    'trumpet',
    'violin_or_fiddle',
    'whispering',
    'writing',
    'abandoned_dog',
    'animal_cruelty',
    'baby_crying',
    'bees',
    'car_alarm',
    'crying_woman',
    'door',
    'explosion',
    'ferocious_dog',
    'fire_detector',
    'footsteps',
    'glass_crash',
    'gun_shot',
    'hush',
    'male_yell',
    'ringtone',
    'shrill_or_scream',
    'sob',
    'spray',
    'stray_child',
    'stream',
    'vandlism',
    'vibration',
    'voice_english',
    'voice_korean',
    'voice_mandarin',
    'vomit',
    'whistle',
  ];

  playPauseann(value) {
    var start = value;
    this.wavesurfer.play(start);
  }

  playregion() {
    this.wavesurfer.on('region-click', function (region, e) {
      console.log(region.start);
      console.log(region.end);
      e.stopPropagation();
      this.wavesurfer.play(region.start, region.end);
    });
  }

  eventLog = {
    id: '',
  };

  makeSoundEventsBarChart(log) {
    myBarChart = new Chart('SoundEventsBarChart', {
      type: 'bar',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
          {
            data: [80, 59, 80, 81, 56, 13, 80, 59, 80, 81, 56, 13],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          xAxes: [
            {
              ticks: {
                min: 0, // Controls where axis starts
                max: 12, // Controls where axis finishes
              },
            },
          ],
        },
      },
    });
  }

  getRandomData(numOfDatas) {
    var datas = [];
    console.log(numOfDatas);
    for (var i = 0; i < numOfDatas; i++) {
      var val = Math.random();

      if (val < 0.2) {
        console.log(val);
        datas.push(val);
      } else {
        i--;
      }
    }
    console.log(datas);
    datas[Math.round(Math.random() * 12)] = 0.9947;
    return datas;
  }

  makeSituationPredictionChart(log) {
    var datas = log.situation.preds;
    myBarChart = new Chart('SituationPredictionChart', {
      type: 'horizontalBar',
      data: {
        labels: this.situationList,
        datasets: [
          {
            data: datas,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'x',
        legend: {
          display: false,
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          xAxes: [
            {
              ticks: {
                fontSize: 10,
                min: 0, // Controls where axis starts
                max: 1, // Controls where axis finishe
              },
            },
          ],
        },
      },
    });
  }

  makeEventDetailsChart(log) {
    const labels = [10, 20, 30];
    const yLabels = [];
    console.log(log.seds);
    const pointData = [];
    log['seds'].forEach((sed) => {
      sed['events'].forEach((event) => {
        if (this.ingnoreEventList.indexOf(event) < 0) {
          if (yLabels.indexOf(event) < 0) {
            yLabels.push(event);
          }
          console.log(sed);
          console.log(event);
          console.log(sed.preds[sed.events.indexOf(event)]);
          pointData.push({
            x: (sed.end + sed.start) / 2,
            y: yLabels.indexOf(event),
            r: 15 * sed.preds[sed.events.indexOf(event)],
          });
        }
      });
    });
    console.log(pointData);
    console.log(yLabels);
    const data = {
      labels: labels,
      datasets: [
        {
          data: pointData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
        },
      ],
    };
    const config = {
      type: 'bubble',
      data: data,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bubble Chart',
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: yLabels.length,
                stepSize: 1,
                display: true,
                callback: function (label, index, labels) {
                  // if(label == 5){
                  //     return "일반상황"
                  // }
                  // return 'CODE '+label;
                  return yLabels[label];
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                min: 0, // Controls where axis starts
                max: 10, // Controls where axis finishes
                stepSize: 0.25,
                callback: function (label, index, labels) {
                  return label + 's';
                },
              },
            },
          ],
        },
      },
    };

    var chart = new Chart('eventDetails', config);
  }

  makeWaveForm(log) {
    console.log(log);
    if (this.wavesurfer == null) {
      this.wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#00ff00',
        progressColor: '#4353FF',
        cursorColor: '#4353FF',
        height: 100,
        pixelRatio: 1,
        scrollParent: true,
        backend: 'MediaElement',
        plugins: [
          WaveSurfer.regions.create({
            regionsMinLength: 2,
            regions: [
              // {
              //     start: 5,
              //     end: 17,
              //     loop: false,
              //     drag: false,
              //     resize: false,
              //     color: 'hsla(200, 50%, 70%, 0.4)'
              // }
            ],
            dragSelection: {
              slop: 5,
            },
          }),
          WaveSurfer.minimap.create({
            height: 30,
            waveColor: '#ddd',
            progressColor: '#999',
            cursorColor: '#999',
          }),
          WaveSurfer.timeline.create({
            container: '#wave-timeline',
          }),
          WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px',
            },
          }),
          WaveSurfer.elan.create({
            container: '#annotations',
            tiers: {
              Text: true,
              Comments: true,
            },
          }),
        ],
      });
      this.wavesurfer.on('region-click', function (region, e) {
        e.stopPropagation();
        // Play on click, loop on shift click
        e.shiftKey ? region.playLoop() : region.play();
      });
      this.wavesurfer.elan.on('ready', function (data) {
        this.wavesurfer.load('../assets/audio/sample.xml');
      });

      this.wavesurfer.elan.on('select', function (start, end) {
        console.log(this.wavesurfer);
        this.wavesurfer.backend.play(start, end);
      });

      this.wavesurfer.elan.on('ready', function () {
        let classList =
          this.wavesurfer.elan.container.querySelector('table').classList;
        ['table', 'table-striped', 'table-hover'].forEach(function (cl) {
          classList.add(cl);
        });
      });
    }
    // this.wavesurfer.load('../assets/audio/situ_sexual_violence_bg-76_0-0-0.wav');
    this.wavesurfer.load(log.sound_url);
    this.wavesurfer.stop();
  }

  makeGraphs(log) {
    this.makeEventDetailsChart(log);
    this.makeSituationPredictionChart(log);
    // this.makeSoundEventsBarChart(log);
    this.makeWaveForm(log);
  }

  noticeSelected(log) {
    this.makeGraphs(log);
  }
}
