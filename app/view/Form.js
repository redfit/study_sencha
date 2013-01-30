Ext.define('Memo.view.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'memoform',
    config: {
        items: {
            xtype: 'textareafield',
            name: 'memo',
            height: 800
        }
    }
});
