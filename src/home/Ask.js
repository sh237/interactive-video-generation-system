import axios from "axios";

export const Ask = async (target_word, is_first, mode) => {
    const API_URL = "https://api.openai.com/v1/";
    const MODEL = process.env.MODEL;
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    let response;
    try {
        var time = "10秒";

        const common_rule = `動画の時間は${time}程度を想定しています。出力は、動画の原稿のみで、他の文章は一切書かないでください。BGMやSEなど、人間の口から発することができない要素を出力に含むことも禁止します。出力に絶対に記載しないでください。もし、どうしても原稿以外の要素を記載したい場合は（）で囲んでください。あなたは必ずこれら全てのルールを守らなくてはいけない。`;

        let order = is_first
            ? "動画の原稿を作成したいと考えています。指定する単語と、そのベースとなる知識、関連分野について解説する動画を作成してください。あなたは必ずこれら全てのルールを守らなくてはいけない。以降、この回答としてあなたが生成した原稿・動画のことを「元動画」と呼びます。"
            : "元動画について視聴者から質問がきました。質問への回答をメインに、ベースとなる知識、関連分野について解説する動画を作成してください。回答は必ず元動画に関連したものにしてください。原稿は、必ず「前回の動画について質問きてた!」からはじめてください。あなたは必ずこれらのルールを守らなくてはいけない。";

        let mode_order;
        if (mode == 1) {
            mode_order =
                "単語の解説や質問への回答に加えて、必ず、その単語に関して全く知識がない人でも興味が湧くような、面白く興味深い話を入れてください。面白く興味深い話の前の行には、必ず「（面白く興味深い話）」と一字一句違わないように記載してください。面白く興味深い話の終わりにはなにも書かないでください。視聴者がフレンドリーな印象を抱くような口調にしてください。原稿は、必ず「皆さんこんにちは、本日は○○について紹介します。」からはじめてください。あなたは必ずこれらのルールを守らなくてはいけない。";
        } else if (mode == 2) {
            mode_order =
                "単語の解説や質問への回答の際、キザでかっこつけた口調にしてください。「〜か？」、「お前」、「俺」などの言葉を使うような性格になりきってください。女性をときめかせてください。視聴者をファンにするために、かっこよく、かつ多くの知識を提供してください。原稿は、必ず「本日は○○について紹介するぜ。」からはじめてください。あなたは必ずこれらのルールを守らなくてはいけない。";
        } else if (mode == 3) {
            mode_order =
                "単語の解説や質問への回答の際、女性アイドルのように可愛い口調にしてください。あなたはアイドルになりきってください。視聴者をファンにするために、かわいく、かつ多くの知識を提供してください。原稿は、必ず「みんな〜、こんにちは！」からはじめてください。あなたは必ずこれらのルールを守らなくてはいけない。";
        }

        let user_prompt = is_first
            ? `次の単語について動画の原稿を作成してください。 「${target_word}」`
            : `前回の動画について質問がきています。「${target_word}」`;

        let messages = [
            {
                role: "system",
                content: order,
            },
            {
                role: "system",
                content: mode_order,
            },
            {
                role: "system",
                content: common_rule,
            },
            {
                role: "user",
                content: user_prompt,
            },
        ];

        response = await axios.post(
            `${API_URL}chat/completions`,
            {
                // モデル ID の指定
                model: MODEL,
                // 質問内容
                messages: messages,
            },
            {
                // 送信する HTTP ヘッダー(認証情報)
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );
        // 回答の取得
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return null;
    }
};
