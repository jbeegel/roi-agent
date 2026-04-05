// Vercel Edge Runtime — supports streaming + longer timeouts
export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are a senior enterprise AI transformation consultant with live web search capabilities. You produce consultant-grade Process Automation Opportunity Assessments that are company-specific, benchmark-validated, and board-ready.

RESEARCH MANDATE:
You must search the web to gather real intelligence before producing any analysis. Never rely on training data alone for company facts, benchmarks, or competitor examples — always verify with current searches.

REQUIRED RESEARCH STEPS (execute all of them):
1. Company size & profile: "[company name] employees headcount 2024 2025"
2. Company tech stack: "[company name] ERP technology systems SAP Oracle Salesforce"
3. Company AI/digital news: "[company name] digital transformation AI technology 2024 2025"
4. Industry ROI benchmarks: "[industry] process automation ROI cost savings statistics 2024"
5. Process-specific case study: "[process type] automation AI case study [industry] results"
6. Competitor examples: "fortune 500 [industry] [process] automation results savings"

ANALYSIS RULES:
- Every ROI % must cite a source found in research
- Break the described process into 5-8 specific sub-processes automatically
- Score each sub-process: automation feasibility (%), time consumed (%), complexity
- If company-specific data is unavailable, state data_confidence: "Low" and use industry averages
- Flag when benchmark data comes from research vs. general knowledge
- Sequence phases by dependency — quick wins must genuinely be executable in <6 weeks

RETURN ONLY THIS EXACT JSON STRUCTURE — no other text, no markdown, pure JSON:
{
  "company_profile": {
    "name": "company name",
    "industry": "industry",
    "estimated_employee_count": "X,XXX (source or 'estimated')",
    "known_tech_stack": ["SAP", "Salesforce", "etc — only what research confirms"],
    "ai_maturity_signal": "what research found about their digital journey",
    "recent_relevant_news": "any relevant news found",
    "data_confidence": "High|Medium|Low",
    "confidence_note": "why confidence is this level"
  },
  "research_log": [
    {
      "query": "exact search query used",
      "key_finding": "most relevant thing found (1-2 sentences)",
      "source": "domain.com",
      "relevance": "why this matters to the analysis"
    }
  ],
  "industry_benchmarks": {
    "automation_roi_range": "X-Y% (source: ...)",
    "typical_payback_months": "X-Y months (source: ...)",
    "peer_adoption_rate": "X% of peers have automated this (source: ...)",
    "top_performing_peers": "companies in this industry that have achieved results, with specifics",
    "benchmark_source_quality": "High|Medium|Low"
  },
  "process_decomposition": {
    "process_name": "cleaned up process name",
    "estimated_scope": "based on industry norms for a company this size",
    "sub_processes": [
      {
        "name": "specific sub-process name",
        "what_happens_manually": "concrete description of the manual work",
        "automation_feasibility_pct": 75,
        "time_allocation_pct": 20,
        "ai_approach": "specific approach: e.g. 'LLM + OCR pipeline for document extraction, then rules engine for validation'",
        "recommended_tools": ["Tool A", "Tool B"],
        "complexity": "Low|Medium|High",
        "dependencies": ["depends on sub-process X"],
        "priority_rank": 1
      }
    ]
  },
  "opportunities": [
    {
      "sub_process": "name",
      "rank": 1,
      "gross_annual_savings_per_fte": 8000,
      "implementation_cost_usd": 45000,
      "roi_percent": 180,
      "payback_months": 7,
      "implementation_weeks": 4,
      "complexity": "Low|Medium|High",
      "is_quick_win": true,
      "benchmark_context": "peers achieved X% savings on this specific sub-process (source)",
      "risk_note": "main risk to flag"
    }
  ],
  "total_metrics": {
    "annual_savings_per_fte_in_process": 0,
    "total_implementation_cost": 0,
    "blended_roi_percent": 0,
    "payback_months": 0,
    "vs_benchmark": "this estimate is X% above/below the industry average of Y% ROI (source)"
  },
  "implementation_phases": [
    {
      "phase": 1,
      "name": "Quick Wins",
      "timeline": "Weeks 1-6",
      "sub_processes": ["names"],
      "savings_per_fte": 0,
      "investment": 0,
      "key_actions": ["specific action 1", "specific action 2", "specific action 3"],
      "success_metric": "how to measure this phase worked"
    }
  ],
  "executive_summary": "3-4 paragraphs. Open with a specific statement about this company using research data. Include benchmark comparison. Name specific sub-processes and their expected impact. End with the total opportunity and recommended first move. This should read like a McKinsey slide note — specific, cited, credible.",
  "board_bullets": [
    "Lead with total $ opportunity, scaled to their employee count if known — cite benchmark source",
    "Name 2-3 specific quick wins with timelines and expected savings — reference any competitor who has done this",
    "Address risk and governance — what makes this safe to deploy at enterprise scale"
  ],
  "competitor_context": "2-3 sentences on what real named competitors or peers have achieved with this process, with sources. This is the paragraph that makes the CFO lean forward.",
  "governance_compliance": "Specific regulatory considerations for this industry + this process type. Reference actual regulations (SOX, HIPAA, GDPR, etc.) that apply.",
  "next_steps": [
    "Specific action this week",
    "Specific action within 30 days",
    "Specific action within 90 days"
  ]
}`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: 'ANTHROPIC_API_KEY environment variable not set. See README for Vercel setup.' })}\n\n`,
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const body = await req.json();
  const { company, industry, processDescription, peopleCount } = body;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        send({ type: 'start', message: 'Agent initialized — beginning research protocol' });

        const userPrompt = `ANALYZE THIS AUTOMATION OPPORTUNITY:

Company: ${company}
Industry: ${industry}
Process to analyze: ${processDescription}
${peopleCount ? `People currently doing this process: ~${peopleCount}` : 'Headcount for this process: not specified (use industry norms to estimate)'}

Execute the full research protocol. Search for real company data, real industry benchmarks, and real competitor examples. Then produce the complete JSON assessment.`;

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            stream: true,
            tools: [{ type: 'web_search_20250305', name: 'web_search' }],
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userPrompt }]
          })
        });

        if (!anthropicRes.ok) {
          const errText = await anthropicRes.text();
          throw new Error(`Anthropic API ${anthropicRes.status}: ${errText.substring(0, 300)}`);
        }

        const reader = anthropicRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';
        let partialInputs = {};
        let searchCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') continue;

            let event;
            try { event = JSON.parse(raw); } catch { continue; }

            // New content block starting
            if (event.type === 'content_block_start') {
              const block = event.content_block;
              if (block.type === 'tool_use' && block.name === 'web_search') {
                searchCount++;
                partialInputs[event.index] = { id: block.id, query: '' };
                send({ type: 'search_start', count: searchCount, index: event.index });
              }
              if (block.type === 'tool_result') {
                send({ type: 'result_received', count: searchCount });
              }
            }

            // Content block delta
            if (event.type === 'content_block_delta') {
              const d = event.delta;

              // Accumulate text output
              if (d.type === 'text_delta') {
                fullText += d.text ?? '';
              }

              // Accumulate tool input JSON to extract query
              if (d.type === 'input_json_delta') {
                const slot = partialInputs[event.index];
                if (slot) {
                  slot.query += d.partial_json ?? '';
                  // Try extracting query once we have enough
                  if (!slot.sent && slot.query.includes('"query"')) {
                    const m = slot.query.match(/"query"\s*:\s*"([^"]+)"/);
                    if (m) {
                      slot.sent = true;
                      send({ type: 'search', query: m[1], count: searchCount });
                    }
                  }
                }
              }
            }

            // Block finished
            if (event.type === 'content_block_stop') {
              const slot = partialInputs[event.index];
              if (slot && !slot.sent) {
                // Last chance to extract query
                try {
                  const parsed = JSON.parse(slot.query);
                  if (parsed.query) send({ type: 'search', query: parsed.query, count: searchCount });
                } catch {}
              }
            }

            // Message done
            if (event.type === 'message_delta' && event.delta?.stop_reason === 'end_turn') {
              send({ type: 'synthesizing', message: 'Research complete — structuring deliverable...' });
            }
          }
        }

        // Parse the final JSON result
        if (!fullText.trim()) throw new Error('Agent produced no text output. Check API key and model availability.');

        const clean = fullText.replace(/^```json?\s*/im, '').replace(/\s*```\s*$/m, '').trim();

        let result;
        try {
          result = JSON.parse(clean);
        } catch (e) {
          // Try to find JSON in the text
          const jsonStart = clean.indexOf('{');
          const jsonEnd = clean.lastIndexOf('}');
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            try {
              result = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
            } catch {
              throw new Error('Could not parse agent output as JSON. The agent may need more time. Try again with a more specific process description.');
            }
          } else {
            throw new Error('Agent did not return JSON. Raw output: ' + clean.substring(0, 400));
          }
        }

        send({ type: 'complete', result, searchCount });

      } catch (err) {
        send({ type: 'error', message: err.message });
      }

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
