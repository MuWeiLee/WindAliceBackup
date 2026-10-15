"""Run an isolated permission smoke test for the local HTML prototype."""

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
    assert "当前机构" in page.locator(".current-org").inner_text()
    assert "万得" in page.locator(".current-org").inner_text()
    assert page.locator("#topPrimary").inner_text() == "管理成员"
    assert page.locator(".page-head .btn").count() == 0
    page.locator("#accountTrigger").click()
    assert page.locator("#accountMenu").is_visible()
    page.keyboard.press("Escape")
    assert page.locator("#accountMenu").is_hidden()
    assert page.locator("#accountTrigger").get_attribute("aria-expanded") == "false"
    page.locator("#accountTrigger").click()
    page.locator("[data-action='account-permissions']").click()
    assert "全部组织" in page.locator("#modal").inner_text()
    page.locator("#modal [data-action='close-modal']").click()
    page.locator("#nav [data-page='admins']").click()
    assert "管理范围：万得艾思 / Wind Alice / 产品研发及下级" in page.locator("#view").inner_text()

    page.locator("#accountTrigger").click()
    page.locator("#roleSelect").select_option("admin:m2")
    assert page.locator("#nav [data-page='admins']").count() == 0
    assert page.locator("#nav [data-page='content']").count() == 1
    assert page.locator("#view h1").inner_text() == "组织架构"
    assert page.locator("#topPrimary [data-action='add-node']").count() == 0

    page.locator("#nav [data-page='members']").click()
    assert page.locator("#topPrimary [data-action='add-member']").count() == 1
    names = page.locator(".data-table tbody .name").all_inner_texts()
    assert names == ["张澄"], names
    assert page.locator(".data-table [data-action='edit-member']").count() == 0

    page.locator("[data-action='add-member']").click()
    assert page.locator("#mfNode option").all_inner_texts() == [
        "万得艾思 / Wind Alice / 产品研发"
    ]
    page.locator("#mfName").fill("权限测试成员")
    page.locator("#mfPhone").fill("13300139999")
    page.locator("#saveMember").click()
    assert "权限测试成员" in page.locator(".data-table tbody").inner_text()

    added = page.locator(".data-table tbody tr").filter(has_text="权限测试成员")
    added.locator("[data-action='edit-member']").click()
    assert page.locator("#mfNode option").all_inner_texts() == [
        "万得艾思 / Wind Alice / 产品研发"
    ]
    page.locator("#mfStatus").select_option("disabled")
    page.locator("#saveMember").click()
    page.locator("#memberFilter").select_option("disabled")
    added = page.locator(".data-table tbody tr").filter(has_text="权限测试成员")
    assert added.count() == 1
    added.locator("[data-action='edit-member']").click()
    page.locator("#mfStatus").select_option("active")
    page.locator("#saveMember").click()
    page.locator("#memberFilter").select_option("active")
    added = page.locator(".data-table tbody tr").filter(has_text="权限测试成员")
    added.locator("[data-action='remove-member']").click()
    page.locator("#confirmAction").click()
    page.locator("#memberFilter").select_option("removed")
    added = page.locator(".data-table tbody tr").filter(has_text="权限测试成员")
    assert added.count() == 1
    added.locator("[data-action='restore-member']").click()
    page.locator("#memberFilter").select_option("active")
    assert "权限测试成员" in page.locator(".data-table tbody").inner_text()

    page.locator("#accountTrigger").click()
    page.locator("#roleSelect").select_option("owner")
    page.locator("#nav [data-page='admins']").click()
    page.locator("[data-action='add-admin']").click()
    page.locator("#adminNode").select_option("ais-wa")
    page.locator("#adminCandidate").select_option("m3")
    page.locator("#confirmAdmin").click()

    page.locator("#accountTrigger").click()
    page.locator("#roleSelect").select_option("admin:m3")
    page.locator("#nav [data-page='members']").click()
    names = page.locator(".data-table tbody .name").all_inner_texts()
    assert "张澄" in names and "陈遥" in names and "李沐" not in names, names
    assert page.locator(".data-table [data-action='edit-member']").count() == 1
    assert not errors, errors

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto(HTML.as_uri())
    mobile.wait_for_load_state("networkidle")
    assert mobile.locator("#mobileAccountTrigger").is_visible()
    assert mobile.locator("#accountTrigger").is_hidden()
    assert mobile.locator(".mobile-org").inner_text() == "万得"
    assert mobile.locator("#topPrimary").inner_text() == "管理成员"
    mobile.locator("#mobileAccountTrigger").click()
    assert mobile.locator("#accountMenu").is_visible()
    mobile.keyboard.press("Escape")
    assert mobile.locator("#accountMenu").is_hidden()
    mobile.close()
    browser.close()

print("Admin node-scope smoke test passed")
