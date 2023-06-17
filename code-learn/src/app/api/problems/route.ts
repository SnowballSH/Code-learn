export async function POST(request: Request) {
    const { id }: { id: number; } = await request.json();

    switch (id) {
        case 0:
            const data = {
                id: 0,
                task: "计算列表的算术平均值",
                description: "用input()函数输入一个列表，然后用print()函数输出这个列表的算术平均值。算数平均值是所有数字的总和除以数字的个数。",
                examples: [
                    {
                        input: "3 -8 0 5 2",
                        output: "0.4",
                    },
                    {
                        input: "5 7",
                        output: "6.0",
                    },
                ]
            };
            return new Response(JSON.stringify(data));
        default:
            // Return a 404 if the id is not found
            return new Response('Not found', { status: 404 });
    }
}
