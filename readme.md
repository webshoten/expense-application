# 概要

## 初期環境構築

```bash
# SSTプロジェクト作成
npx sst@latest init

# Remixプロジェクト作成
mkdir packages/web
cd packages/web
npx create-remix@latest .
```

## デプロイ

```bash
# 開発中
npx sst dev
# リソース削除
npx sst remove
# 開発環境デプロイ
npx sst deploy --stage dev
# 開発環境リソース削除
npx sst remove --stage dev
```

## graphql環境構築

```bash
cd packages/web
npm i graphql-yoga @graphql-yoga/common urql @pothos/core
```
