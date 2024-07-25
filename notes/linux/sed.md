# sed

> 推荐使用`sed -E`

```bash
sed -E SCRIPT FILE
sed -E -e SCRIPT FILE
sed -E -f SCRFILE FILE # 从文件中读取脚本
sed -E -n SCRIPT FILE # 仅显示script处理后的结果
sed -E -i SCRIPT FILE # 修改源文件
```

## SCRIPT

`[addr]X[options]`

### addr

- *n*: 行数
- $: 最后一行
- /*regexp*/: 正则
- *start-addr*,*end-addr*: 范围

### X

- a: 下插 `sed '1ahello'`
- i: 上插 `sed '1ihello'`
- d: 删除 `sed '1,2d'`
- c: 修改 `sed '1chello'`
- s: 取代 `sed 's/hello/你好/'` or `sed 's/hello/你好/g'`
- p: 打印 `sed -n '$p'`

> `X`的后面空格会被认为是分隔符，不会传入`X`的操作中，若要传入空格要用反斜杠，如`sed '1a\ hello'`
