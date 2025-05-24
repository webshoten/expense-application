import SchemaBuilder from "@pothos/core";

export interface Employee {
    id: number;
    name: string;
}

const builder = new SchemaBuilder<{
    Objects: {
        Employee: Employee;
    };
}>({});

builder.objectType("Employee", {
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
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
    }),
});

export const schema = builder.toSchema();
