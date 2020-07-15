# Elasticsearch

## 简介

Elasticsearch 是一个开源的基于 Lucene 的 RESTful API 的面向 JSON 文档的分布式搜索引擎。

![](./es/elasticsearch.svg)

> 大致结构可以与 MongoDB 对应，需要注意的是在 elasticsearch 中，同一个 type 中的同一个字段必须要有相同的类型，MongoDB 则没有这个要求。究其原因，是因为 Elasticsearch 为同一个 type 的每一个存在的字段都建立了倒排索引。