import SchemaBuilder from "@pothos/core";
import { analyzeInvoiceResolver } from "./analize-invoice-resolver";
import {
    deleteObject,
    getPresignedGetUrl,
    getPresignedPutUrls,
} from "@/actions/s3";

/**
 *  Type
 */
export interface Employee {
    id: number;
    name: string;
}
export interface Invoice {
    company: string;
    amount: string;
    yyyymmdd: string;
}
export interface S3PresignedUrl {
    url: string;
}

export interface S3PresignedUrls {
    getUrl: string;
    putUrl: string;
}

const builder = new SchemaBuilder<{
    Objects: {
        Employee: Employee;
        Invoice: Invoice;
        S3PresignedUrl: S3PresignedUrl;
        S3PresignedUrls: S3PresignedUrls;
    };
}>({});

/**
 * GraphQL Type
 */
builder.objectType("Employee", {
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
    }),
});
builder.objectType("S3PresignedUrl", {
    fields: (t) => ({
        url: t.exposeString("url"),
    }),
});

builder.objectType("S3PresignedUrls", {
    fields: (t) => ({
        getUrl: t.exposeString("getUrl"),
        putUrl: t.exposeString("putUrl"),
    }),
});

builder.objectType("Invoice", {
    fields: (t) => ({
        company: t.exposeString("company"),
        amount: t.exposeString("amount"),
        yyyymmdd: t.exposeString("yyyymmdd"),
    }),
});

const employees: Employee[] = [
    { id: 1, name: "hiroshi nohara" },
];

builder.queryType({
    fields: (t) => ({
        employees: t.field({
            type: ["Employee"],
            resolve: () => employees,
        }),
        employee: t.field({
            type: "Employee",
            nullable: true,
            args: {
                id: t.arg.int({ required: true }),
            },
            resolve: (_, args) => {
                return employees.find((employee) => employee.id === args.id) ||
                    null;
            },
        }),
    }),
});

builder.mutationType({
    fields: (t) => ({
        addEmployee: t.field({
            type: "Employee",
            args: {
                name: t.arg.string({ required: true }),
            },
            resolve: (_, args) => {
                const _employee = {
                    // カウントアップ
                    id: (employees && employees.length > 0
                        ? employees?.at(-1)?.id as number
                        : 0) + 1,
                    name: args.name,
                };
                employees.push(_employee);
                return _employee;
            },
        }),

        analyzeInvoice: t.field({
            type: "Invoice",
            nullable: true,
            args: {
                imageUrl: t.arg.string({ required: true }),
            },
            resolve: (_, args) => {
                return analyzeInvoiceResolver(args);
            },
        }),

        getS3PresignedUrl: t.field({
            type: "S3PresignedUrl",
            args: {
                key: t.arg.string({ required: true }),
            },
            resolve: async (_, { key }) => {
                const url = await getPresignedGetUrl({ key });
                return { url };
            },
        }),

        getS3PresignedUrls: t.field({
            type: "S3PresignedUrls",
            args: {
                key: t.arg.string({ required: true }),
                fileType: t.arg.string({ required: true }),
            },
            resolve: async (_, { key, fileType }) => {
                const getUrl = await getPresignedGetUrl({ key });
                const putUrl = await getPresignedPutUrls({ key, fileType });
                return { getUrl, putUrl };
            },
        }),

        deleteS3: t.field({
            type: "Boolean",
            args: {
                key: t.arg.string({ required: true }),
            },
            resolve: async (_, { key }) => {
                try {
                    await deleteObject({ key });
                    return true;
                } catch (error) {
                    return false;
                }
            },
        }),
    }),
});

export const schema = builder.toSchema();
