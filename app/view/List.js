Ext.define('Memo.view.List', {
    extend: 'Ext.dataview.List',      // 1
    xtype: 'memolist',                // 2
    config: {
      xtype: 'list',
      data: [
        { title: 'ham'},
        { title: 'egg'},
        { title: 'spam'}
      ],
      itemTpl: '{title}'
    }
});
