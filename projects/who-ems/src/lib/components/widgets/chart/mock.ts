export const LINE = {
    series: [{
        name: 'India',
        style: 'smooth',
        type: 'line',
        data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
    }, {
        name: 'Russian Federation',
        style: 'step',
        type: 'line',
        data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
    }, {
        name: 'Germany',
        style: 'normal',
        type: 'line',
        data: [0.010, -0.375, 1.161, 0.684, 3.7, 3.269, 1.083, -5.127, 3.690, 2.995]
    }, {
        name: 'World',
        style: 'smooth',
        type: 'line',
        data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
    }],
    categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011]
};

export const CIRCULAR = {
    series: [
        {
            name: 'Chart data',
            data: [
                {
                    value: 3,
                    category: 'National NGO'
                },
                {
                    value: 3,
                    category: 'Local NGO'
                },
                {
                    value: 1,
                    category: 'Red Cross'
                },
                {
                    value: 0,
                    category: null
                }
            ]
        }
    ]
};

export const BAR = {
    series: [{
        _id: 'National NGO',
        data: [
          {
            y: 'STI & HIV/AIDS',
            x: 3
          },
          {
            y: 'Child Health',
            x: 1
          },
          {
            y: 'Sexual Violence',
            x: 1
          },
          {
            y: 'Environmental Health',
            x: 1
          },
          {
            y: 'Non-Communicable Disease and Mental Health',
            x: 1
          },
          {
            y: 'Communicable Disease',
            x: 2
          }
        ],
        color: 'National NGO'
      },
      {
        _id: 'Red Cross',
        data: [
          {
            y: 'Sexual Violence',
            x: 1
          },
          {
            y: 'Environmental Health',
            x: 1
          },
          {
            y: 'Older People',
            x: 1
          }
        ],
        color: 'Red Cross'
      },
      {
        _id: 'Local NGO',
        data: [
          {
            y: 'STI & HIV/AIDS',
            x: 1
          },
          {
            y: 'Child Health',
            x: 2
          },
          {
            y: 'Sexual Violence',
            x: 1
          },
          {
            y: 'Environmental Health',
            x: 1
          },
          {
            y: 'Maternal and Newborn Health',
            x: 3
          },
          {
            y: 'Non-Communicable Disease and Mental Health',
            x: 1
          }
        ],
        color: 'Local NGO'
      }],
    categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011]
};

export const COLUMN = {
    series: [{
        name: 'India',
        style: 'smooth',
        data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
    }, {
        name: 'Russian Federation',
        style: 'step',
        data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
    }, {
        name: 'Germany',
        style: 'normal',
        data: [0.010, -0.375, 1.161, 0.684, 3.7, 3.269, 1.083, -5.127, 3.690, 2.995]
    }, {
        name: 'World',
        style: 'smooth',
        data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
    }],
    categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011]
};

export const SCATTER = {
    series: [
        {
            name: 'one',
            data: [
                { yField: 16.4, xField: 5.4 },
                { yField: 21.7, xField: 2 },
                { yField: 25.4, xField: 3 },
                { yField: 19, xField: 2 },
                { yField: 10.9, xField: 1 },
                { yField: 13.6, xField: 3.2 },
                { yField: 10.9, xField: 7.4 },
                { yField: 10.9, xField: 0 },
                { yField: 10.9, xField: 8.2 },
                { yField: 16.4, xField: 0 },
                { yField: 16.4, xField: 1.8 },
                { yField: 13.6, xField: 0.3 },
                { yField: 29.9, xField: 0 },
                { yField: 27.1, xField: 2.3 },
                { yField: 16.4, xField: 0 },
              ]
        },
        {
            name: 'two',
            data: [
                { yField: 16, xField: 5.4 },
                { yField: 21, xField: 2 },
                { yField: 25, xField: 3 },
                { yField: 19.3, xField: 2 },
                { yField: 10, xField: 1 },
                { yField: 13, xField: 3.2 },
                { yField: 10, xField: 7.4 },
                { yField: 10, xField: 0 },
                { yField: 10, xField: 8.2 },
                { yField: 16, xField: 0 },
                { yField: 16, xField: 1.8 },
                { yField: 13, xField: 0.3 },
                { yField: 29, xField: 0 },
                { yField: 27, xField: 2.3 },
                { yField: 16, xField: 0 },
              ]
        }
    ]
};
