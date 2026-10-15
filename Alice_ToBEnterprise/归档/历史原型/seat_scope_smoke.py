"""Check Owner, node Admin, seats, functions, and scoped records in the HTML demo."""

from pathlib import Path

from playwright.sync_api import sync_playwright


HTML = Path(__file__).with_name("历史_组织节点亮色原型.html")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    )
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(HTML.as_uri())
    page.wait_for_load_state("networkidle")

    assert page.locator("#view h1").inner_text() == "概览"
    assert "总席位" in page.locator("#view").inner_text()
    assert "24" in page.locator("#view").inner_text()

    page.locator("#nav [data-page='resources']").click()
    assert page.locator("#view h1").inner_text() == "组织资源"
    assert "待分配席位" in page.locator("#view").inner_text()
    page.screenshot(path=str(HTML.with_name("机构工作台_席位_预览.png")), full_page=True)
    page.locator("#resourceScope").select_option("ais")
    page.locator("[data-action='set-quota'][data-id='ais']").click()
    page.locator("#quotaValue").fill("30")
    page.locator("#confirmQuota").click()
    assert "请输入" in page.locator("#toast").inner_text()
    page.locator("#quotaValue").fill("13")
    page.locator("#confirmQuota").click()
    assert "13 席" in page.locator(".seat-summary").inner_text()

    page.locator("#nav [data-page='org']").click()
    assert "Owner · 默认" in page.locator("#inspector").inner_text()
    page.locator("#nav [data-page='admins']").click()
    page.locator("[data-action='add-admin']").click()
    page.locator("#adminNode").select_option("ais-wa")
    choices = page.locator("#adminCandidate option").all_inner_texts()
    assert any("张澄" in choice for choice in choices), choices
    assert any("陈遥" in choice for choice in choices), choices
    assert not any("李沐" in choice for choice in choices), choices
    page.locator("#adminCandidate").select_option("m3")
    page.locator("#confirmAdmin").click()
    page.locator("#nav [data-page='permissions']").click()
    page.locator("#featureScope").select_option("ais-wa")
    company_skill = page.locator(".feature-row").filter(has_text="公司分析技能")
    assert "未开通" in company_skill.inner_text()
    company_skill.locator("[data-action='toggle-feature-grant']").click()
    assert "可用" in page.locator(".feature-row").filter(
        has_text="公司分析技能"
    ).inner_text()

    page.locator("#accountTrigger").click()
    page.locator("#roleSelect").select_option("admin:m2")
    assert page.locator("#nav [data-page='admins']").count() == 0
    page.locator("#nav [data-page='content']").click()
    content = page.locator("#view").inner_text()
    assert "四季度策略路演材料" in content
    assert "半导体行业景气度分析" not in content
    page.locator("#nav [data-page='shares']").click()
    assert "四季度策略路演材料" in page.locator("#view").inner_text()
    assert "新能源产业跟踪摘要" not in page.locator("#view").inner_text()
    page.locator("#nav [data-page='usage']").click()
    assert "张澄" in page.locator("#view").inner_text()
    assert "陈遥" not in page.locator("#view").inner_text()
    page.locator("#nav [data-page='permissions']").click()
    company_skill = page.locator(".feature-row").filter(has_text="公司分析技能")
    assert "可用" in company_skill.inner_text()
    company_skill.locator("[data-action='toggle-feature']").click()
    assert "本节点已关闭" in page.locator(".feature-row").filter(
        has_text="公司分析技能"
    ).inner_text()

    page.locator("#nav [data-page='members']").click()
    page.locator("[data-action='add-member']").click()
    page.locator("#mfName").fill("席位测试成员")
    page.locator("#mfPhone").fill("13300139999")
    page.locator("#saveMember").click()
    page.locator("#nav [data-page='resources']").click()
    assert "席位测试成员" in page.locator("#view").inner_text()
    page.locator(".resource-row").filter(has_text="席位测试成员").locator(
        "[data-action='assign-seat']"
    ).click()
    assert "已分配" in page.locator(".resource-row").filter(
        has_text="席位测试成员"
    ).inner_text()

    page.locator("#accountTrigger").click()
    page.locator("#roleSelect").select_option("admin:m3")
    page.locator("#nav [data-page='content']").click()
    content = page.locator("#view").inner_text()
    assert "四季度策略路演材料" in content
    assert "半导体行业景气度分析" in content
    assert "股票数据整理任务" not in content
    page.locator("#nav [data-page='resources']").click()
    assert page.locator("[data-action='set-quota'][data-id='ais-wa']").count() == 0
    assert page.locator("[data-action='set-quota'][data-id='ais-wa-rd']").count() == 1

    assert not errors, errors
    browser.close()

print("Seat and Admin scope smoke test passed")
