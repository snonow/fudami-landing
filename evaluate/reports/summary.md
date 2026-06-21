# Evaluation Report

## Methodology

Benchmarks are run against real open-source repositories.
Token counts use a consistent `len(text) // 4` approximation.
Impact accuracy reports two ground-truth modes: graph-derived (circular — upper bound) and co-change (files co-changed in the same commit, seed excluded).
Rows with `status=error` are kept for forensics but excluded from all aggregates.

## Token Efficiency

| repo | commit | description | changed_files | naive_tokens | standard_tokens | graph_tokens | naive_to_graph_ratio | standard_to_graph_ratio | status | error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | 528801f841e519567ef54d6e52e9b9831d162e1b | feat: add multi-platform MCP server installation support | 3 | 10858 | 4147 | 194794 | 0.1 | 0.0 | ok |  |
| code-review-graph | 84bde35459c52e1e0c4b25c6c4799743021e0fc7 | feat: add Google Antigravity platform support for MCP install | 2 | 8113 | 394 | 184298 | 0.0 | 0.0 | ok |  |
| express | 925a1dff1e42f1b393c977b8b77757fcf633e09f | fix: bump qs minimum to ^6.14.2 for CVE-2026-2391 | 1 | 682 | 82 | 1015 | 0.7 | 0.1 | ok |  |
| express | b4ab7d65d7724d9309b6faaaf82ad492da2a6d35 | test: include edge case tests for res.type() | 1 | 703 | 510 | 78073 | 0.0 | 0.0 | ok |  |
| fastapi | fa3588c38c7473aca7536b12d686102de4b0f407 | Fix typo for client_secret in OAuth2 form docstrings | 1 | 6045 | 299 | 176139 | 0.0 | 0.0 | ok |  |
| fastapi | 0227991a01e61bf5cdd93cc00e9e243f52b47a4a | Exclude spam comments from statistics in scripts/people.py | 1 | 3844 | 735 | 120936 | 0.0 | 0.0 | ok |  |
| flask | fbb6f0bc4c60a0bada0e03c3480d0ccf30a3c1df | all teardown callbacks are called despite errors | 10 | 72069 | 4656 | 385654 | 0.2 | 0.0 | ok |  |
| flask | a29f88ce6f2f9843bd6fcbbfce1390a2071965d6 | document that headers must be set before streaming | 4 | 12917 | 1136 | 105469 | 0.1 | 0.0 | ok |  |
| gin | 052d1a79aafe3f04078a2716f8e77d4340308383 | feat(render): add PDF renderer and tests | 5 | 44085 | 958 | 327229 | 0.1 | 0.0 | ok |  |
| gin | 472d086af2acd924cb4b9d7be0525f7d790f69bc | fix(tree): panic in findCaseInsensitivePathRec with RedirectFixedPath | 2 | 13879 | 1347 | 95541 | 0.1 | 0.0 | ok |  |
| gin | 5c00df8afadd06cc5be530dde00fe6d9fa4a2e4a | fix(render): write content length in Data.Render | 2 | 4702 | 517 | 174001 | 0.0 | 0.0 | ok |  |
| httpx | ae1b9f66238f75ced3ced5e4485408435de10768 | Expose FunctionAuth in __all__ | 3 | 16816 | 267 | 157087 | 0.1 | 0.0 | ok |  |
| httpx | b55d4635701d9dc22928ee647880c76b078ba3f2 | Upgrade Python type checker mypy | 4 | 7248 | 820 | 162960 | 0.0 | 0.0 | ok |  |

## Impact Accuracy

| repo | commit | ground_truth_mode | seed_file | predicted_files | actual_files | true_positives | precision | recall | f1 | status | error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | 528801f841e519567ef54d6e52e9b9831d162e1b | graph-derived (circular — upper bound) |  | 6 | 3 | 3 | 0.5 | 1.0 | 0.667 | ok |  |
| code-review-graph | 528801f841e519567ef54d6e52e9b9831d162e1b | co-change (same commit, seed excluded) | code_review_graph/cli.py | 0 | 2 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| code-review-graph | 84bde35459c52e1e0c4b25c6c4799743021e0fc7 | graph-derived (circular — upper bound) |  | 3 | 2 | 2 | 0.667 | 1.0 | 0.8 | ok |  |
| code-review-graph | 84bde35459c52e1e0c4b25c6c4799743021e0fc7 | co-change (same commit, seed excluded) | code_review_graph/cli.py | 0 | 1 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| express | 925a1dff1e42f1b393c977b8b77757fcf633e09f | graph-derived (circular — upper bound) |  | 2 | 1 | 1 | 0.5 | 1.0 | 0.667 | ok |  |
| express | 925a1dff1e42f1b393c977b8b77757fcf633e09f | co-change (same commit, seed excluded) | package.json |  |  |  |  |  |  | skipped | single-file commit: no co-changed files to grade against |
| express | b4ab7d65d7724d9309b6faaaf82ad492da2a6d35 | graph-derived (circular — upper bound) |  | 2 | 1 | 1 | 0.5 | 1.0 | 0.667 | ok |  |
| express | b4ab7d65d7724d9309b6faaaf82ad492da2a6d35 | co-change (same commit, seed excluded) | test/res.type.js |  |  |  |  |  |  | skipped | single-file commit: no co-changed files to grade against |
| fastapi | fa3588c38c7473aca7536b12d686102de4b0f407 | graph-derived (circular — upper bound) |  | 1 | 1 | 1 | 1.0 | 1.0 | 1.0 | ok |  |
| fastapi | fa3588c38c7473aca7536b12d686102de4b0f407 | co-change (same commit, seed excluded) | fastapi/security/oauth2.py |  |  |  |  |  |  | skipped | single-file commit: no co-changed files to grade against |
| fastapi | 0227991a01e61bf5cdd93cc00e9e243f52b47a4a | graph-derived (circular — upper bound) |  | 2 | 1 | 1 | 0.5 | 1.0 | 0.667 | ok |  |
| fastapi | 0227991a01e61bf5cdd93cc00e9e243f52b47a4a | co-change (same commit, seed excluded) | scripts/people.py |  |  |  |  |  |  | skipped | single-file commit: no co-changed files to grade against |
| flask | fbb6f0bc4c60a0bada0e03c3480d0ccf30a3c1df | graph-derived (circular — upper bound) |  | 33 | 10 | 10 | 0.303 | 1.0 | 0.465 | ok |  |
| flask | fbb6f0bc4c60a0bada0e03c3480d0ccf30a3c1df | co-change (same commit, seed excluded) | CHANGES.rst | 0 | 9 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| flask | a29f88ce6f2f9843bd6fcbbfce1390a2071965d6 | graph-derived (circular — upper bound) |  | 6 | 4 | 4 | 0.667 | 1.0 | 0.8 | ok |  |
| flask | a29f88ce6f2f9843bd6fcbbfce1390a2071965d6 | co-change (same commit, seed excluded) | docs/patterns/streaming.rst | 0 | 3 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| gin | 052d1a79aafe3f04078a2716f8e77d4340308383 | graph-derived (circular — upper bound) |  | 12 | 5 | 5 | 0.417 | 1.0 | 0.588 | ok |  |
| gin | 052d1a79aafe3f04078a2716f8e77d4340308383 | co-change (same commit, seed excluded) | context.go | 0 | 4 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| gin | 472d086af2acd924cb4b9d7be0525f7d790f69bc | graph-derived (circular — upper bound) |  | 5 | 2 | 2 | 0.4 | 1.0 | 0.571 | ok |  |
| gin | 472d086af2acd924cb4b9d7be0525f7d790f69bc | co-change (same commit, seed excluded) | tree.go | 0 | 1 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| gin | 5c00df8afadd06cc5be530dde00fe6d9fa4a2e4a | graph-derived (circular — upper bound) |  | 4 | 2 | 2 | 0.5 | 1.0 | 0.667 | ok |  |
| gin | 5c00df8afadd06cc5be530dde00fe6d9fa4a2e4a | co-change (same commit, seed excluded) | render/data.go | 0 | 1 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| httpx | ae1b9f66238f75ced3ced5e4485408435de10768 | graph-derived (circular — upper bound) |  | 3 | 3 | 3 | 1.0 | 1.0 | 1.0 | ok |  |
| httpx | ae1b9f66238f75ced3ced5e4485408435de10768 | co-change (same commit, seed excluded) | CHANGELOG.md | 0 | 2 | 0 | 0.0 | 0.0 | 0.0 | ok |  |
| httpx | b55d4635701d9dc22928ee647880c76b078ba3f2 | graph-derived (circular — upper bound) |  | 7 | 4 | 4 | 0.571 | 1.0 | 0.727 | ok |  |
| httpx | b55d4635701d9dc22928ee647880c76b078ba3f2 | co-change (same commit, seed excluded) | requirements.txt | 0 | 3 | 0 | 0.0 | 0.0 | 0.0 | ok |  |

## Agent Baseline

| repo | question | terms | files_matched | top_files | baseline_tokens | graph_tokens | baseline_to_graph_ratio | status | error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | How does GraphStore upsert_node store a node | upsert_node graphstore store node | 3 | code_review_graph/tools.py;code_review_graph/parser.py;tests/test_tools.py | 41674 | 0 |  | no_graph_results |  |
| code-review-graph | Where does full_build parse the repository | full_build parse repository | 3 | tests/test_parser.py;tests/test_multilang.py;code_review_graph/cli.py | 15028 | 0 |  | no_graph_results |  |
| code-review-graph | How does hybrid_search rank search results | hybrid_search rank search results | 3 | code_review_graph/tools.py;tests/test_search.py;code_review_graph/search.py | 21701 | 0 |  | no_graph_results |  |
| express | How does app.handle process the middleware stack | app.handle process middleware stack | 3 | test/app.use.js;test/Router.js;test/app.router.js | 14951 | 0 |  | no_graph_results |  |
| express | Where does res.send write the response body | res.send write response body | 3 | lib/response.js;test/express.raw.js;test/res.sendFile.js | 16257 | 0 |  | no_graph_results |  |
| express | How does createApplication initialize an app | createapplication initialize app | 3 | test/app.router.js;test/express.urlencoded.js;test/express.json.js | 20050 | 0 |  | no_graph_results |  |
| fastapi | How does include_router register routes on the application | include_router register routes application | 3 | tests/test_include_router_defaults_overrides.py;tests/test_application.py;tests/test_generate_unique_id_function.py | 132479 | 0 |  | no_graph_results |  |
| fastapi | Where does APIRoute build its route handler | apiroute build route handler | 3 | fastapi/routing.py;tests/test_include_router_defaults_overrides.py;fastapi/applications.py | 193488 | 0 |  | no_graph_results |  |
| fastapi | How does solve_dependencies resolve Depends parameters | solve_dependencies resolve depends parameters | 3 | tests/test_include_router_defaults_overrides.py;tests/test_dependency_overrides.py;fastapi/routing.py | 150986 | 0 |  | no_graph_results |  |
| flask | How does dispatch_request route an incoming HTTP request | dispatch_request route incoming http request | 3 | tests/test_basic.py;src/flask/app.py;src/flask/sansio/scaffold.py | 36555 | 0 |  | no_graph_results |  |
| flask | Where is the AppContext pushed and popped | appcontext pushed popped | 3 | src/flask/ctx.py;src/flask/app.py;tests/test_signals.py | 20692 | 0 |  | no_graph_results |  |
| flask | How does create_logger configure application logging | create_logger configure application logging | 3 | src/flask/sansio/app.py;src/flask/app.py;tests/test_logging.py | 25587 | 0 |  | no_graph_results |  |
| gin | How does Engine.ServeHTTP route an incoming request | engine.servehttp route incoming request | 3 | context_test.go;routes_test.go;gin_test.go | 40433 | 0 |  | no_graph_results |  |
| gin | Where does Context.Next advance the middleware chain | context.next advance middleware chain | 3 | gin_test.go;gin.go;middleware_test.go | 14654 | 0 |  | no_graph_results |  |
| gin | How does the node tree match wildcard routes | node tree match wildcard routes | 3 | tree_test.go;tree.go;gin.go | 20685 | 0 |  | no_graph_results |  |
| httpx | How does Client.request send an HTTP request | client.request send http request | 3 | httpx/_client.py;tests/models/test_url.py;tests/client/test_redirects.py | 27419 | 0 |  | no_graph_results |  |
| httpx | Where are Response headers parsed and decoded | response headers parsed decoded | 3 | tests/models/test_responses.py;httpx/_client.py;tests/client/test_redirects.py | 28302 | 0 |  | no_graph_results |  |
| httpx | How does BaseClient build request URLs | baseclient build request urls | 3 | httpx/_client.py;tests/models/test_requests.py;tests/test_content.py | 22800 | 0 |  | no_graph_results |  |

## Flow Completeness

| repo | known_entry_points | detected_entry_points | recall | detected_flows | avg_flow_depth | max_flow_depth |
| --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | 2 | 0 | 0.0 | 104 | 1.6 | 5 |
| express | 2 | 0 | 0.0 | 4 | 1.0 | 1 |
| fastapi | 2 | 2 | 1.0 | 165 | 1.8 | 6 |
| flask | 2 | 0 | 0.0 | 78 | 1.5 | 4 |
| gin | 2 | 1 | 0.5 | 114 | 1.4 | 5 |
| httpx | 2 | 2 | 1.0 | 128 | 2.7 | 10 |

## Search Quality

| repo | query | expected | rank | reciprocal_rank |
| --- | --- | --- | --- | --- |
| code-review-graph | GraphStore nodes | code_review_graph/graph.py::GraphStore | 0 | 0.0 |
| code-review-graph | parse AST | code_review_graph/parser.py::CodeParser | 0 | 0.0 |
| code-review-graph | full build | code_review_graph/incremental.py::full_build | 1 | 1.0 |
| express | app handle | lib/application.js::app | 0 | 0.0 |
| express | response send | lib/response.js::res | 0 | 0.0 |
| express | request | lib/request.js::req | 0 | 0.0 |
| fastapi | FastAPI application | fastapi/applications.py::FastAPI | 1 | 1.0 |
| fastapi | APIRoute routing | fastapi/routing.py::APIRoute | 1 | 1.0 |
| fastapi | Depends injection | fastapi/params.py::Depends | 0 | 0.0 |
| flask | Flask wsgi | src/flask/app.py::Flask | 1 | 1.0 |
| flask | AppContext globals | src/flask/ctx.py::AppContext | 0 | 0.0 |
| flask | create logger | src/flask/logging.py::create_logger | 1 | 1.0 |
| gin | Engine ServeHTTP | gin.go::Engine | 1 | 1.0 |
| gin | Context request | context.go::Context | 1 | 1.0 |
| gin | node tree | tree.go::node | 1 | 1.0 |
| httpx | Client request | httpx/_client.py::Client | 1 | 1.0 |
| httpx | Response headers | httpx/_models.py::Response | 0 | 0.0 |
| httpx | BaseClient | httpx/_client.py::BaseClient | 1 | 1.0 |

## Build Performance

| repo | file_count | node_count | edge_count | flow_detection_seconds | community_detection_seconds | search_avg_ms | nodes_per_second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | 92 | 1418 | 8877 | 0.035 | 0.059 | 0.7 | 40436 |
| express | 141 | 1912 | 18877 | 0.043 | 0.113 | 0.1 | 44135 |
| fastapi | 1128 | 6292 | 32081 | 0.134 | 0.27 | 0.2 | 47110 |
| flask | 86 | 1415 | 8259 | 0.029 | 0.062 | 0.7 | 48099 |
| gin | 98 | 1589 | 17237 | 0.045 | 0.096 | 0.8 | 35235 |
| httpx | 68 | 1261 | 8228 | 0.031 | 0.055 | 0.2 | 40253 |

## Multi Hop Retrieval

| repo | task_id | nl_query | anchor_found | anchor_rank | neighbor_count | expected_count | matched_count | neighbor_recall | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code-review-graph | crg-parse-file-callers | Who invokes the parser entry point on a single source file | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| code-review-graph | crg-upsert-node-callers | Where the graph store inserts or updates a node | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| express | express-create-application-callees | What express does when constructing an application | False | -1 | 0 | 3 | 0 | 0.0 | 0.0 |
| fastapi | fastapi-route-handler-callers | How fastapi binds a route handler to an APIRoute | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| fastapi | fastapi-get-dependant-callers | Where fastapi resolves dependency declarations into a tree | False | -1 | 0 | 2 | 0 | 0.0 | 0.0 |
| flask | flask-dispatch-callers | Where Flask dispatches HTTP requests | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| flask | flask-exception-callers | Where Flask handles uncaught exceptions | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| gin | gin-serve-http-callees | What does the gin engine do when serving an HTTP request | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
| gin | gin-context-next-callers | Who advances the gin middleware chain via Context.Next | False | -1 | 0 | 2 | 0 | 0.0 | 0.0 |
| httpx | httpx-client-request-callers | Which HTTP verbs route through the httpx Client.request | False | -1 | 0 | 6 | 0 | 0.0 | 0.0 |
| httpx | httpx-async-request-tests | Tests covering the httpx async client request method | False | -1 | 0 | 1 | 0 | 0.0 | 0.0 |
