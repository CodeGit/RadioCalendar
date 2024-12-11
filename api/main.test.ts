import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import app from "./main.ts";
import config from "./config/config.json"  with { type: "json" };
const PORT = 8100

Deno.test("Testing API version", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/version`);
    const body = await response.json();
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, { version: "1.0.0" }, "Response body does not match");
    controller.abort();
});

Deno.test("Testing API stations", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/stations`);
    const body = await response.json();
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, config.stations, "Response body does not match");
    controller.abort();
});

Deno.test("Testing API station", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/station/${config.stations[0].key}`);
    const body = await response.json();
    console.log(JSON.stringify(body));
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, config.stations[0], "Response body does not match");
    controller.abort();
});

Deno.test("Testing API station", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/station/${config.stations[0].key}`);
    const body = await response.json();
    console.log(JSON.stringify(body));
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, config.stations[0], "Response body does not match");
    controller.abort();
});

Deno.test("Testing API station", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/station/${config.stations[0].key}`);
    const body = await response.json();
    console.log(JSON.stringify(body));
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, config.stations[0], "Response body does not match");
    controller.abort();
});

Deno.test("Testing API week of year", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const api = app.listen({ port: PORT, signal });
    
    const response = await fetch(`http://localhost:${PORT}/api/station/${config.stations[0].key}/year/2024/week/30`);
    console.log(response);
    const body = await response.json();
    assertEquals(response.status, 200, "Response status does not match");
    assertEquals(body, config.stations[0], "Response body does not match");
    controller.abort();
});