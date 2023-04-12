use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use dotenvy::dotenv;
use rs_openai::{
    chat::{ChatCompletionMessageRequestBuilder, CreateChatRequestBuilder, Role},
    OpenAI,
};
use serde::{Deserialize, Serialize};
use std::env::var;

struct APIState {
    api_key: String,
    org_id: String,
}

#[get("/api/hello")]
async fn hello(_data: web::Data<APIState>) -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[derive(Deserialize, Serialize)]
struct Message {
    role: i32,
    msg: String,
}

#[derive(Deserialize, Serialize)]
struct PromptRequest {
    history: Vec<Message>,
}

#[derive(Deserialize, Serialize)]
struct PromptRespond {
    result: String,
}

async fn prompt_gpt(
    data: PromptRequest,
    client: &OpenAI,
) -> Result<String, Box<dyn std::error::Error>> {
    let message_history = data.history.iter().map(|x| {
        ChatCompletionMessageRequestBuilder::default()
            .role(if x.role == 0 {
                Role::Assistant
            } else {
                Role::User
            })
            .content(x.msg.clone())
            .build()
            .unwrap()
    });

    let req = CreateChatRequestBuilder::default()
        .model("gpt-3.5-turbo")
        .messages(message_history.collect::<Vec<_>>())
        .build()?;

    let res = client.chat().create(&req).await?;
    return Ok(res.choices[0].message.content.clone());
}

#[post("/api/prompt")]
async fn prompt(data: web::Data<APIState>, req_body: web::Json<PromptRequest>) -> impl Responder {
    let client = OpenAI::new(&OpenAI {
        api_key: data.api_key.clone(),
        org_id: Some(data.org_id.clone()),
    });

    let ans = prompt_gpt(req_body.0, &client).await;
    if let Ok(ans) = ans {
        let res = PromptRespond { result: ans };
        HttpResponse::Ok().json(web::Json(res))
    } else {
        eprintln!("{:?}", ans);
        HttpResponse::InternalServerError().json(web::Json(ans.err().unwrap().to_string()))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    HttpServer::new(|| {
        let api_key = var("OPENAI_API_KEY").unwrap();
        let org_id = var("OPENAI_API_ORGANIZATION").unwrap();

        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(APIState { api_key, org_id }))
            .service(hello)
            .service(prompt)
    })
    .bind((
        "0.0.0.0",
        std::env::var("PORT")
            .unwrap_or("8080".to_string())
            .parse()
            .unwrap_or(8080),
    ))?
    .run()
    .await
}
