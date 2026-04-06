export const config = { runtime: 'edge' };

const ROLE_FRAMES = {
  finance:      { title:'Finance & Accounting',      metrics:'cost reduction, payback period, cash flow impact, audit risk elimination',          tone:'CFO-ready: precise dollars, payback periods, risk. Cite every claim.' },
  marketing:    { title:'Marketing & Growth',        metrics:'pipeline impact, content efficiency, CAC reduction, organic traffic, campaign ROI',  tone:'CMO-ready: revenue and growth framing. Connect automation to pipeline, CAC, brand scale.' },
  operations:   { title:'Operations',                metrics:'FTE savings, cycle time, error rates, throughput, process capacity',                tone:'COO-ready: throughput and efficiency. FTE savings, SLA improvements, capacity unlocked.' },
  hr:           { title:'HR & People',               metrics:'time-to-hire, admin burden, retention impact, compliance coverage',                  tone:'CHRO-ready: people framing. Admin time saved = strategic HR capacity gained.' },
  technology:   { title:'Technology & IT',           metrics:'incident MTTR, tech debt, security posture, engineering velocity',                   tone:'CIO-ready: technical depth. Integration complexity, security, scalability named.' },
  legal:        { title:'Legal & Compliance',        metrics:'risk exposure, compliance coverage, contract velocity, regulatory penalties avoided',  tone:'GC-ready: risk framing. Every compliance implication named explicitly.' },
  cx:           { title:'Customer Success & CX',     metrics:'CSAT, resolution time, deflection rate, NPS, churn reduction',                      tone:'CCO-ready: customer outcome framing. Automation → retention, satisfaction, loyalty.' },
  leadership:   { title:'Strategy & Leadership',     metrics:'total opportunity, competitive positioning, strategic optionality, board narrative',   tone:'CEO-ready: strategic framing. Big numbers, competitive context, org transformation.' },
  revenue:      { title:'Revenue & Sales',           metrics:'pipeline velocity, rep productivity, forecast accuracy, revenue leakage',             tone:'CRO-ready: revenue framing. Automation → quota attainment, pipeline, win rates.' },
  risk:         { title:'Risk & Compliance',         metrics:'regulatory exposure, audit readiness, control effectiveness, incident probability',   tone:'Risk-ready: control framing. Regulatory consequences named. Mitigation quantified.' },
  clinical:     { title:'Clinical Operations',       metrics:'physician time recovered, patient throughput, care quality, documentation burden',    tone:'CMO/CNO-ready: clinical outcome framing. Time saved = patient care delivered.' },
  supply_chain: { title:'Supply Chain & Quality',    metrics:'inventory cost, lead times, defect rates, supply chain resilience',                  tone:'VP Supply Chain-ready: inventory, lead time, and quality metrics.' },
  product:      { title:'Product & Engineering',     metrics:'velocity, deployment frequency, bug resolution, feature throughput',                  tone:'CPO-ready: velocity and quality. Ship faster, break less, scale reliably.' },
};

const SYSTEM_PROMPT = `You are a senior enterprise AI transformation consultant with live web search. Produce a role-specific, research-backed Process Automation Opportunity Assessment.

ROLE CONTEXT: You are analyzing for a ROLE_TITLE. Frame all output for this role:
- Their key metrics: METRIC_FOCUS
- Output tone: OUTPUT_TONE

RESEARCH (execute all 5 before analysis):
1. "[company] employees headcount size revenue 2024 2025"
2. "[company] AI digital transformation technology news"
3. "[industry] ROLE_TITLE process automation ROI benchmarks 2024 2025"
4. "[process type] automation AI case study [industry] results"
5. "fortune 500 [industry] [process] automation results peer examples"

SYSTEMS IN USE: SYSTEMS_LIST — always recommend automation that integrates with these specific tools.

SCORING: Effort 1-10 (1-3=<4wks<$30K existing tools, 4-6=4-12wks $30-150K, 7-10=>12wks>$150K). Impact 1-10 (1-3=<$50K/yr, 4-6=$50-200K/yr, 7-10=>$200K/yr strategic).

RETURN ONLY VALID JSON — no markdown fences, no preamble:
{
  "company_profile": { "name":"","industry":"","role_context":"what this org looks like from this role's lens","estimated_size":"with source","tech_stack_confirmed":[],"ai_maturity":"Exploring|Developing|Advancing|Leading","digital_signals":"","data_confidence":"High|Medium|Low","confidence_note":"" },
  "research_log": [{ "query":"","key_finding":"","source":"domain.com" }],
  "industry_benchmarks": { "automation_roi_range":"X-Y% (source)","typical_payback_months":"X-Y months (source)","peer_adoption_pct":"X% (source)","top_peer_result":"Company achieved X (source)" },
  "process_decomposition": [{
    "sub_process":"","manual_description":"what their team does today","automation_approach":"specific method using their stack",
    "tools_recommended":[],"feasibility_pct":75,"time_allocation_pct":20,"effort_score":3,"impact_score":8,
    "complexity":"Low|Medium|High","priority_rank":1,"is_quick_win":true,"role_specific_benefit":"why this matters to this role"
  }],
  "opportunities": [{
    "rank":1,"sub_process":"","current_annual_cost_per_fte":12000,"gross_savings_per_fte_annual":9000,
    "implementation_cost":25000,"roi_pct":360,"payback_months":3,"effort_score":2,"impact_score":9,
    "weeks_to_deploy":4,"complexity":"Low","is_quick_win":true,"benchmark_proof":"Peer achieved X (source)",
    "risk":"one sentence","systems_integration":"how this connects to their stack",
    "role_kpi_impact":"impact in this role's metric language"
  }],
  "total_metrics": { "total_annual_savings_per_fte":0,"total_implementation_cost":0,"blended_roi_pct":0,"payback_months":0,"quick_win_savings_per_fte":0,"quick_win_investment":0,"vs_industry_benchmark":"" },
  "prioritization_matrix": { "quadrant_1_do_first":[],"quadrant_2_plan_next":[],"quadrant_3_quick_fill":[],"quadrant_4_deprioritize":[] },
  "phases": [{ "phase":1,"name":"","timeline":"","processes":[],"savings_per_fte":0,"investment":0,"actions":[],"success_metric":"KPI this role tracks","systems_involved":[] }],
  "command_center_config": {
    "kpi_1":{"label":"role KPI 1","baseline":0,"target":0,"unit":"hrs|USD|pct|count"},
    "kpi_2":{"label":"role KPI 2","baseline":0,"target":0,"unit":"hrs|USD|pct|count"},
    "kpi_3":{"label":"role KPI 3","baseline":0,"target":0,"unit":"hrs|USD|pct|count"},
    "kpi_4":{"label":"role KPI 4","baseline":0,"target":0,"unit":"hrs|USD|pct|count"},
    "monthly_savings_projection":[0,0,0,0,0,0,0,0,0,0,0,0],
    "department_adoption":[{"dept":"","score":0}]
  },
  "executive_summary":"4 paragraphs for a ROLE_TITLE: (1) Company-specific opening using research. (2) Opportunity in their metric language with dollar figures. (3) First move with rationale for this role. (4) Risk and governance relevant to their function.",
  "board_bullets":["$ opportunity in their metric language with source","specific quick wins + peer reference","risk mitigation relevant to their function"],
  "competitor_context":"2-3 sentences: named peers, specific results, sources.",
  "governance_note":"Compliance considerations for this industry and this role's function specifically.",
  "playbook":{ "week_1":[],"week_2_4":[],"month_2_3":[],"month_3_6":[] },
  "next_steps":["this week","within 30 days","within 90 days"]
}`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' } });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response(`data: ${JSON.stringify({ type:'error', message:'ANTHROPIC_API_KEY not set.' })}\n\n`, { headers: { 'Content-Type':'text/event-stream' } });

  const { company, industry, role, customRoleDesc, selectedProcesses, customProcess, systems, employeeCount, avgSalary, riskTolerance, primaryGoal } = await req.json();

  // Handle custom role: use the user's description to build a dynamic frame
  let rf;
  if(role==='custom'&&customRoleDesc){
    const cd=customRoleDesc.trim();
    rf={
      title: cd.length>60?cd.slice(0,60)+'...':cd,
      metrics:'the specific KPIs and success metrics relevant to this role as described',
      tone:'Adapt tone precisely to this role: '+cd+'. Frame output in the language and priorities of this specific function and seniority level.'
    };
  } else {
    rf = ROLE_FRAMES[role] || ROLE_FRAMES.leadership;
  }
  const processDesc = [...(selectedProcesses||[]), ...(customProcess?[customProcess]:[])].join('; ');
  const systemsList = (systems||[]).join(', ') || 'not specified';

  const sysPrompt = SYSTEM_PROMPT
    .replace(/ROLE_TITLE/g, rf.title)
    .replace(/METRIC_FOCUS/g, rf.metrics)
    .replace(/OUTPUT_TONE/g, rf.tone)
    .replace(/SYSTEMS_LIST/g, systemsList);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = d => controller.enqueue(encoder.encode(`data: ${JSON.stringify(d)}\n\n`));
      try {
        send({ type:'start', roleTitle: rf.title });
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST',
          headers:{ 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01' },
          body: JSON.stringify({
            model:'claude-sonnet-4-20250514', max_tokens:10000, stream:true,
            tools:[{ type:'web_search_20250305', name:'web_search' }],
            system: sysPrompt,
            messages:[{ role:'user', content:`ANALYZE:\nCompany: ${company||'Not specified'}\nIndustry: ${industry}\nRole: ${rf.title}\nGoal: ${primaryGoal||'Efficiency'}\nProcesses: ${processDesc}\nStack: ${systemsList}\nEmployees in scope: ${employeeCount||'estimate'}\nSalary: $${avgSalary||120000}/yr\nRisk: ${riskTolerance||'Moderate'}\n\nExecute all 5 research steps. Frame for a ${rf.title}. Return complete JSON.` }]
          })
        });
        if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).substring(0,200)}`);

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf='', text='', partial={}, searches=0;
        while(true) {
          const {done,value} = await reader.read();
          if(done) break;
          buf += dec.decode(value,{stream:true});
          const lines = buf.split('\n'); buf = lines.pop()??'';
          for(const line of lines) {
            if(!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if(!raw||raw==='[DONE]') continue;
            let ev; try{ev=JSON.parse(raw);}catch{continue;}
            if(ev.type==='content_block_start'&&ev.content_block?.type==='tool_use'&&ev.content_block?.name==='web_search') {
              searches++; partial[ev.index]={q:''}; send({type:'search_start',count:searches});
            }
            if(ev.type==='content_block_delta') {
              if(ev.delta?.type==='text_delta') text+=ev.delta.text??'';
              if(ev.delta?.type==='input_json_delta'&&partial[ev.index]) {
                partial[ev.index].q+=ev.delta.partial_json??'';
                if(!partial[ev.index].sent&&partial[ev.index].q.includes('"query"')) {
                  const m=partial[ev.index].q.match(/"query"\s*:\s*"([^"]+)"/);
                  if(m){partial[ev.index].sent=true;send({type:'search',query:m[1],count:searches});}
                }
              }
            }
            if(ev.type==='content_block_stop'&&partial[ev.index]&&!partial[ev.index].sent) {
              try{const p=JSON.parse(partial[ev.index].q);if(p.query)send({type:'search',query:p.query,count:searches});}catch{}
            }
            if(ev.type==='message_delta'&&ev.delta?.stop_reason==='end_turn') send({type:'synthesizing'});
          }
        }
        if(!text.trim()) throw new Error('No output. Check API key credits at console.anthropic.com');
        const clean=text.replace(/^```json?\s*/im,'').replace(/\s*```\s*$/m,'').trim();
        let result; try{result=JSON.parse(clean);}catch{
          const s=clean.indexOf('{'),e=clean.lastIndexOf('}');
          if(s>=0&&e>s){try{result=JSON.parse(clean.slice(s,e+1));}catch{throw new Error('Could not parse output. Try a more specific process description.');}}
          else throw new Error('Agent returned no structured data. Please try again.');
        }
        send({type:'complete',result,searchCount:searches});
      } catch(err){send({type:'error',message:err.message});}
      controller.close();
    }
  });
  return new Response(stream,{headers:{'Content-Type':'text/event-stream;charset=utf-8','Cache-Control':'no-cache,no-transform','Connection':'keep-alive','X-Accel-Buffering':'no','Access-Control-Allow-Origin':'*'}});
}
