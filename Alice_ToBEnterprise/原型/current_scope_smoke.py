"""Exercise the narrowed current-phase institution workbench prototype."""

from pathlib import Path

from playwright.sync_api import sync_playwright


HTML = Path(__file__).with_name("企业管理后台_亮色.html")
PREVIEW = Path(__file__).with_name("机构工作台_本期_预览.png")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    )
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(HTML.as_uri())
    page.wait_for_load_state("networkidle")
    assert page.url == HTML.with_name("机构工作台_本期.html").as_uri(), page.url
    assert page.locator("#view h1").inner_text() == "成员管理"
    assert page.locator("#nav .nav-btn").count() == 6
    assert "组织架构" not in page.locator("#nav").inner_text()
    page.screenshot(path=str(PREVIEW), full_page=True)

    page.locator("[data-action='add-member']").click()
    page.locator("#memberPhone").fill("13900139001")
    page.locator("#memberName").fill("重复成员")
    page.locator("#saveMember").click()
    assert "手机号已存在" in page.locator("#toast").inner_text()
    page.locator("#memberPhone").fill("18800138009")
    page.locator("#memberName").fill("测试成员")
    page.locator("#memberEmail").fill("test@example.com")
    page.locator("#saveMember").click()
    assert "测试成员" in page.locator("#view").inner_text()
    row = page.locator("#view tbody tr").filter(has_text="测试成员")
    row.locator("[data-action='edit-member']").click()
    assert not page.locator("#memberPhone").is_editable()
    page.locator("#memberEmail").fill("updated@example.com")
    page.locator("#saveMember").click()
    assert "updated@example.com" in page.locator("#view").inner_text()
    row.locator("[data-action='toggle-member']").click()
    assert "停用" in page.locator("#view tbody tr").filter(
        has_text="测试成员"
    ).locator(".pill").inner_text()
    page.locator("#view tbody tr").filter(
        has_text="测试成员"
    ).locator("[data-action='toggle-member']").click()

    page.locator("#nav [data-page='seats']").click()
    assert "席位总数" in page.locator("#view").inner_text()
    page.locator("[data-action='assign-seat']").click()
    member_value = page.locator("#seatMember option").filter(
        has_text="测试成员"
    ).get_attribute("value")
    page.locator("#seatMember").select_option(member_value)
    page.locator("#seatType").select_option("standard")
    page.locator("#saveSeat").click()
    assert "测试成员" in page.locator("#view").inner_text()
    page.locator("#nav [data-page='members']").click()
    page.locator("#view tbody tr").filter(
        has_text="测试成员"
    ).locator("[data-action='toggle-member']").click()
    page.locator("#nav [data-page='seats']").click()
    assert "测试成员" in page.locator("#view").inner_text()
    page.locator("#nav [data-page='members']").click()
    page.locator("#view tbody tr").filter(
        has_text="测试成员"
    ).locator("[data-action='toggle-member']").click()
    page.locator("#nav [data-page='seats']").click()
    page.locator("[data-action='assign-seat']").click()
    page.locator("#seatMember").select_option(member_value)
    page.locator("#seatType").select_option("standard")
    page.locator("#saveSeat").click()
    assert "已分配此类型席位" in page.locator("#toast").inner_text()
    page.locator("[data-action='close-modal']").click()

    page.locator("#nav [data-page='members']").click()
    page.locator("#view tbody tr").filter(
        has_text="测试成员"
    ).locator("[data-action='remove-member']").click()
    assert "释放其 1 个席位" in page.locator("#modalDescription").inner_text()
    page.locator("#confirmModal").click()
    assert "测试成员" not in page.locator("#view").inner_text()
    page.locator("[data-action='add-member']").click()
    page.locator("#memberPhone").fill("18800138009")
    page.locator("#memberName").fill("再次加入")
    page.locator("#saveMember").click()
    assert "已建立新的机构成员关系" in page.locator("#toast").inner_text()
    relations = page.evaluate(
        """() => JSON.parse(localStorage.getItem('wind-alice-workbench-current-scope-v1'))
          .members.filter(m => m.phone === '18800138009')"""
    )
    assert len(relations) == 2
    assert relations[0]["id"] != relations[1]["id"]
    assert relations[0]["accountId"] == relations[1]["accountId"]
    assert relations[0]["status"] == "removed"
    assert relations[1]["status"] == "enabled"
    page.locator("#nav [data-page='seats']").click()
    assert "测试成员" not in page.locator("#view").inner_text()
    assert "再次加入" not in page.locator("#view").inner_text()

    page.locator("#nav [data-page='dialogues']").click()
    assert "请选择用户" in page.locator("#view").inner_text()
    assert "梳理半导体" not in page.locator("#view").inner_text()
    page.locator("#dialogUserSearch").fill("13900139001")
    assert page.locator("#dialogUser option").count() == 2
    page.locator("#dialogUser").select_option("u002")
    assert "梳理半导体" in page.locator("#view").inner_text()
    assert "基金产品" not in page.locator("#view").inner_text()
    page.locator("[data-action='dialog-detail']").first.click()
    assert "对话输出" in page.locator("#modalBody").inner_text()
    page.locator("[data-action='close-modal']").click()
    page.locator("#nav [data-page='members']").click()
    page.locator("#view tbody tr").filter(
        has_text="张澄"
    ).locator("[data-action='remove-member']").click()
    page.locator("#confirmModal").click()
    page.locator("[data-action='add-member']").click()
    page.locator("#memberPhone").fill("13900139001")
    page.locator("#memberName").fill("张澄")
    page.locator("#saveMember").click()
    page.locator("#nav [data-page='dialogues']").click()
    page.locator("#dialogUserSearch").fill("13900139001")
    options = page.locator("#dialogUser option").all_inner_texts()
    assert len(options) == 3, options
    new_relation = page.evaluate(
        """() => JSON.parse(localStorage.getItem('wind-alice-workbench-current-scope-v1'))
          .members.find(m => m.phone === '13900139001' && m.status === 'enabled').id"""
    )
    page.locator("#dialogUser").select_option(new_relation)
    assert "该用户暂无对话记录" in page.locator("#view").inner_text()
    page.locator("#dialogUser").select_option("u002")
    assert "梳理半导体" in page.locator("#view").inner_text()

    page.locator("#nav [data-page='summary']").click()
    assert "数据更新时间" in page.locator("#view").inner_text()
    page.locator("#summaryLevel").select_option("hourly")
    assert "2026-10-13 15:00—16:00" in page.locator("#view").inner_text()

    page.locator("#nav [data-page='shares']").click()
    assert "Link 看板" in page.locator("#view").inner_text()
    page.locator("[data-tab='download']").click()
    assert "alice.wind.com/download/" in page.locator("#view").inner_text()

    page.locator("#nav [data-page='points']").click()
    assert "用户 ID" in page.locator("#view").inner_text()
    assert "积分记录" == page.locator("#view h1").inner_text()
    page.locator("#pointUser").select_option(new_relation)
    assert "暂无积分记录" in page.locator("#view").inner_text()
    page.locator("#pointUser").select_option("u002")
    assert "半导体行业分析对话" in page.locator("#view").inner_text()
    page.reload()
    page.wait_for_load_state("networkidle")
    relations = page.evaluate(
        """() => JSON.parse(localStorage.getItem('wind-alice-workbench-current-scope-v1'))
          .members.filter(m => m.phone === '13900139001')"""
    )
    assert len(relations) == 2
    assert relations[0]["accountId"] == relations[1]["accountId"]
    page.set_viewport_size({"width": 390, "height": 840})
    page.locator("#mobileTrigger").click()
    assert page.locator("#mobileNav").is_visible()
    page.locator("#mobileAccountTrigger").click()
    assert page.locator("#accountMenu").is_visible()
    assert not errors, errors
    browser.close()

print("Current-scope workbench smoke test passed")
