/**
 * 该案例演示当label太长时候，指定多少个字符后显示省略号。
 * 有两种方式进行处理：
 * 1、从数据中处理，处理完以后再进行渲染；
 * 2、自定义节点或边时，进行处理：
 *  group.addShape('text', {
 *     attrs: {
 *       text: fittingString(cfg.label, 50, 12),
 *       ...
 *     },
 *     name: 'text-shape'
 *  })
 *
 */
import G6 from '@antv/g6';

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = '...';
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp("[\u4E00-\u9FA5]+"); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};

const globalFontSize = 12;

const data = {
  nodes: [
    {
      x: 100,
      y: 100,
      size: 40,
      label: 'This label is too long to be displayed',
      id: 'node1',
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
    {
      x: 300,
      y: 100,
      size: 80,
      label: 'This label is also too long to be displayed',
      id: 'node2',
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      label: 'This label is too long to be displayed',
      labelCfg: {
        refY: 20,
        style: {
          fontSize: globalFontSize
        }
      },
      style: {
        endArrow: true,
      },
    },
  ],
};

const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  defaultNode: {
    style: {
      fill: '#DEE9FF',
      stroke: '#5B8FF9',
    },
    labelCfg: {
      style: {
        fontSize: globalFontSize
      }
    }
  },
  defaultEdge: {
    color: '#F6BD16'
  },
});

// 直接修改原生数据中的label字段
data.nodes.forEach(function (node) {
  node.label = fittingString(node.label, node.size, globalFontSize);
});
data.edges.forEach(function (edge) {
  edge.label = fittingString(edge.label, 120, globalFontSize);
});

graph.data(data);
graph.render();
